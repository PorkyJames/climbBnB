import { test, expect } from "@playwright/test"

test.describe("Login Tests e2e", () => {

    test.beforeEach(async({page}) => {
        await page.goto("http://localhost:3000")
    })

})
