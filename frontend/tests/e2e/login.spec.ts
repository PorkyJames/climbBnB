import { test, expect } from "@playwright/test"

test.describe("Login Tests e2e", () => {

    test.beforeEach(async({page}) => {
        await page.goto("http://localhost:3000")
        //! If Create a Spot Exists, we should log out
        const createSpotBtn = page.locator('[class*="create-a-spot"]')
        if (await createSpotBtn.isVisible()) {
            //we need to log out
            await page.locator('[class*="user-profile"]').click()
            await page.getByText('Log Out').click()
        }
    })

    test("Demo-Login", async ({page}) => {
        await page.locator('[class*="user-profile"]').click()
        await page.getByText('Log In').click()
        await page.getByRole('button', {name: "Log in as Demo User"}).click()
        const createSpotBtn = page.locator('[class*="create-a-spot"]')
        await expect(createSpotBtn).toBeVisible()
    })

    test("Login", async ({page}) => {
        // console.log("Log Out worked!")
        //Arrange
        await page.locator('[class*="user-profile"]').click()
        await page.getByText('Log In').click()

        //Act
        const userEmail = 'user1@user.io'
        await page.locator('[class*="username-or-email-input"]').fill(userEmail)
        await page.locator('[class*="password-input"]').fill("password2")
        const loginBtn = page.getByRole('button', {name: "Log In", exact: true})
        await expect(loginBtn).toBeEnabled()
        await loginBtn.click()

        //Assert
        const createSpotBtn = page.locator('[class*="create-a-spot"]')
        await expect(createSpotBtn).toBeVisible()
        await page.locator('[class*="user-profile"]').click()
        expect(page.locator('[class*=intro-logged]')).toHaveText(userEmail)
    })


})
