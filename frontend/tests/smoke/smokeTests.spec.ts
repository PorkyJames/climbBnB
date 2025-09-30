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

    test("Sign Up User", async({page}) => {
        //Arrange
        await page.locator('[class="user-profile-button"]').click()
        await page.getByRole('button', {name: "Sign Up"}).click()

        //Act
        await page.locator('[class="email-input"]').fill('123@tester.com')
        const genUserName = Date.now()
        await page.locator('[class="username-input"]').fill(`${genUserName}`)
        // ! Can use faker.js or something
        await page.locator('[class="name-input"]').fill('James')
        await page.locator('[class="last-name-input"]').fill('Porky')
        await page.locator('[class="password-input"]').fill('123456')
        await page.locator('[class="confirm-pass-input"]').fill('123456')
        await page.getByRole('button', {name: "Sign Up"}).click()

        //Assert
        const itemOne = page.locator('[class="intro-logged-in"]').nth(0)
        const itemTwo = page.locator('[class="intro-logged-in"]').nth(1)

        //Expect the first item in the intro-logged-in to be Hello James
        //Expect the second item in the intro-logged-in to be the email 123@tester.com

    })
})

test.describe("Logged In Tests", () => {

    test.beforeEach(async ({page}) => {
        await page.goto("http://localhost:3000")
        await page.locator('[class="user-profile-button"]').click()
        await page.getByRole('button', {name: "Log In"}).click()
        await page.getByRole('button', {name: "Log in as Demo User"}).click()
    })

    test("Logout", async({page}) => {
        //Arrange
        //Act
        await page.locator('[class="user-profile-button"]').click()
        await page.locator('[class="log-out-button"]').click()

        //Assert
        const createButton = page.locator('[class="create-a-spot-button"]')
        expect(createButton).not.toBeVisible()
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
