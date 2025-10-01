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

    test("Create and Delete a Review", async({page}) => {
        //Arrange
        await page.getByText("Huge Climbing Gym").click()

        //Act
        //! If there is a Post a Review button, then we'll post a review
        //! If there is a Delete button, then we'll delete the review first, then
        //! post a review. 
        const deleteBtn = page.getByRole('button', {name: "Delete"})
        await deleteBtn.scrollIntoViewIfNeeded()
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

    test("Create and Delete a Spot", async({page}) => {
        //Arrange
        await page.locator('.create-a-spot-button').click()
        //Act
        await page.getByPlaceholder('Country').fill("United States")
        await page.getByPlaceholder('Street Address').fill('18030 Newhope St')
        await page.getByPlaceholder('City').fill('Fountain Valley')
        await page.getByPlaceholder('State').fill('CA')
        await page.getByPlaceholder('Please write at least 30 characters')
            .fill('We opened in 2019 bringing new life into a vacant building that now offers more than 30,000 square feet of bouldering, yoga, and fitness. We honor those with the surf to rock lifestyle and offer plenty of cross-training conditioning and strength spaces. And for those off-days, we hope to see you relaxing on our slackline, in the yoga studio, or in the saunas.')
        await page.getByPlaceholder('Name of your spot').fill('Movement - Fountain Valley')
        await page.getByPlaceholder('Price per night (USD)').fill('50')
        await page.getByPlaceholder('Preview Image URL').fill('https://augustconstructionsolutions.com/wp-content/uploads/2020/12/Planey-Granite-Fountain-Valley-climb-wall.jpg')
        await page.locator('#imageURL1').fill("https://augustconstructionsolutions.com/wp-content/uploads/2020/12/Planet-Granite-Fountain-Valley-retail-shop.jpg")
        await page.locator('#imageURL2').fill("https://movementgyms.com/app/uploads/sites/25/2023/03/Web-Large-Fountain-Valley_MVMT_2023-413.jpg")
        await page.locator('#imageURL3').fill("https://s3-media0.fl.yelpcdn.com/bphoto/viRHG9p9JBgH3m5fV7Z1rw/o.jpg")
        await page.locator('#imageURL4').fill("https://s3-media0.fl.yelpcdn.com/bphoto/Cpntr3G1Xt3gXHau27rOpw/o.jpg")
        await page.getByRole('button', { name: "Create Spot "}).click()

        //Assert
    })

    test("Delete a Spot", async({page}) => {
        //Arrange
        await page.locator('[class="user-profile-button"]').click()
        await page.locator('.manage-spots-button').click()

        //Act
        await page.getByRole('button', {name: "Delete"}).last().click()
        await page.getByRole('button', {name: "Yes (Delete Spot)"}).click()

    })

    test("Update a Spot", async({page}) => {
        //Arrange
        await page.locator('[class="user-profile-button"]').click()
        await page.locator('.manage-spots-button').click()
        await page.getByRole('button', {name: "Update"}).first().click()

        //Act
        const genPrice = Math.floor(Math.random() * 1000).toString()
        await page.locator("#spotPrice").fill(genPrice)
        await page.getByRole('button', {name: "Update Spot"}).click()

        //Assert
        const priceInput = await page.locator(".smol-price").textContent()
        expect(priceInput).toContain(genPrice)
    })

})
