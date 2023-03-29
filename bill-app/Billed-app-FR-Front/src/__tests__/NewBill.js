/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  screen
} from "@testing-library/dom"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import mockStore from '../__mocks__/store'
import router from "../app/Router"
import {
  ROUTES_PATH
} from "../constants/routes"

// It is working only if we import mockStore BEFORE router.
jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {

  describe("When I am on NewBill Page", () => {
    // Pretend we are connected as employee
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    test("Then the mail icon in vertical layout should be highlighted", () => {

      // Setup the router.
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      // Go to the NewBill page.
      window.onNavigate(ROUTES_PATH.NewBill)

      const windowIcon = screen.getByTestId('icon-mail')
      expect(windowIcon).toHaveClass('active-icon')
    })

    test('Then creating a new bill redirects me to the bills page', () => {

      const imageFileMock = new File(['pouet'], 'eevee.png', {
        type: 'image/png'
      })

      // Setup the router.
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      // Go to the NewBill page.
      window.onNavigate(ROUTES_PATH.NewBill)

      // Get all form's fields.
      const form = {
        type: screen.getByTestId('expense-type'),
        name: screen.getByTestId('expense-name'),
        date: screen.getByTestId('datepicker'),
        amount: screen.getByTestId('amount'),
        vat: screen.getByTestId('vat'),
        pct: screen.getByTestId('pct'),
        commentary: screen.getByTestId('commentary'),
        file: screen.getByTestId('file'),
        submit: screen.getByText('Envoyer'),
      }

      // Fill up the form
      fireEvent.change(form.type, {
        target: {
          selectedIndex: 5
        }
      });
      userEvent.type(form.name, 'Voiture de fonction')
      fireEvent.change(form.date, {
        target: {
          value: '2023-03-17'
        }
      })
      userEvent.type(form.amount, '17000')
      userEvent.type(form.vat, '3400')
      userEvent.type(form.pct, '20')
      userEvent.type(form.commentary, 'Clio 4 Rouge')
      fireEvent.change(form.file, {
        target: {
          files: [imageFileMock]
        }
      })

      userEvent.click(form.submit)

      expect(window.location.pathname).toBe('/')
      expect(window.location.hash).toBe(ROUTES_PATH.Bills)
    })

    test('Then only files with .png, .jpg and .jpeg should be accepted', () => {
      const errorMessage = screen.getByTestId("file-error-message");
      const fileInput = screen.getByTestId("file");
      const handleChangeFile = jest.fn(container.handleChangeFile);
      fileInput.addEventListener("change", handleChangeFile);
    })
  })


})