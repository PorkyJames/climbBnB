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

    //! Need to make more dynamic
    test("Sign Up User", async({page}) => {
        //Arrange
        await page.locator('[class="user-profile-button"]').click()
        await page.getByRole('button', {name: "Sign Up"}).click()

        //Act
        await page.locator('[class="email-input"]').fill('43566@tester.com')
        const genUserName = Date.now()
        await page.locator('[class="username-input"]').fill(`${genUserName}`)
        // ! Can use faker.js or something
        await page.locator('[class="name-input"]').fill('James')
        await page.locator('[class="last-name-input"]').fill('Porky')
        await page.locator('[class="password-input"]').fill('123456')
        await page.locator('[class="confirm-pass-input"]').fill('123456')
        await page.getByRole('button', {name: "Sign Up"}).click()

        //Assert
        await page.locator('[class="user-profile-button"]').click()
        const introInfo = page.locator('.intro-logged-in li')
        //Expect the first item in the intro-logged-in to be Hello James
        const testOne = await introInfo.first().textContent()
        expect(testOne).toContain("Hello")        
        //Expect the manage spots button to be in the drop down
        const manageBtn = page.getByRole('link', {name: "Manage Spots"})
        expect(manageBtn).toBeVisible()
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
        await page.getByText("Huge Climbing Gym").click()

        //Act
        //! If there is a Post a Review button, then we'll post a review
        //! If there is a Delete button, then we'll delete the review first, then
        //! post a review. 
        const deleteBtn = page.getByRole('button', {name: "Delete"})
        await deleteBtn.scrollIntoViewIfNeeded()
        // console.log(await deleteBtn.count())
        if (await deleteBtn.count() > 0) {
            await deleteBtn.scrollIntoViewIfNeeded()
            if (await deleteBtn.isVisible()) {
                await deleteBtn.click()
                await page.getByRole('button', {name: "Yes (Delete Review)"}).click()
            }
        }
        
        const postBtn = page.getByRole('button', {name: "Post Your Review"})
        await postBtn.scrollIntoViewIfNeeded()
        await postBtn.click()
        await page.getByPlaceholder('Leave your review here...').fill("This is my review. I enjoyed it!")
        await page.locator('.star').nth(3).click()
        await page.getByRole('button', {name: "Submit Your Review"}).click()
    
        //Assert
        await page.waitForSelector('.reviewer p');
        const reviewer = await page.locator('.reviewer p').allTextContents();
        expect(reviewer).toContain('Demo');
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
