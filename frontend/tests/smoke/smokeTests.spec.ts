import { test, expect } from "@playwright/test"


test.describe("Smoke Tests", () => {

    test.beforeEach(async ({page}) => {
        await page.goto("http://localhost:3000")
    })

    test("Demo-Login", async({page}) => {
        //Arrange
        await page.locator('[class="user-profile-button"]').click()
        
        //Act
        await page.getByRole('button', {name: "Log In"}).click()
        await page.getByRole('button', {name: "Log in as Demo User"}).click()

        //Assert
        const createButton = page.locator('[class="create-a-spot-button"]')
        expect(createButton).toBeVisible()
    })

    test("Login User", async({page}) => {
        //Arrange
        //Act
        //Assert
    })

    test("Sign Up User", async({page}) => {
        //Arrange
        //Act
        //Assert
    })

    test("Leave a Review", async({page}) => {
        //Arrange
        //Act
        //Assert
    })

    test("Update a Spot", async({page}) => {
        //Arrange
        //Act
        //Assert
    })

    test("Delete a Spot", async({page}) => {
        //Arrange
        //Act
        //Assert
    })


})
