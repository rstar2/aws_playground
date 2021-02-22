import { Handler, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import path from 'path';

const dotenvPath = path.join(
    __dirname,
    '../',
    `config/.env.${process.env.NODE_ENV}`
);
dotenv.config({
    path: dotenvPath,
});

import puppeteer from 'puppeteer';
import getChrome from './chrome-script';
import Result from './utils/Result';

const weblateUrl = process.env.WEBLATE_LOGIN_URL as string;
const weblateUsername = process.env.WEBLATE_USERNAME as string;
const weblatePassword = process.env.WEBLATE_PASSWORD as string;

enum StatusCode {
    success = 200,
    error = 500,
}

export const scrape: Handler = async (event: any, _context: Context) => {
    let result;
    let browser;
    try {
        let { url } = event.queryStringParameters || {};
        url = url || weblateUrl;
        const chrome = await getChrome();
        browser = await puppeteer.connect({
            browserWSEndpoint: chrome.endpoint,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });

        // enter login credentials
        await page.type('[name=username]', weblateUsername);
        await page.type('[name=password]', weblatePassword);
        await page.click('[type=submit]');

        await page.waitForSelector('#search', { timeout: 10000 });

        const data = {
            untranslated: 5,
            notified: 3,
        };

        console.error('success', data);
        result = new Result(StatusCode.success, 0, 'success', data);
    } catch (err) {
        console.error(err);

        result = new Result(StatusCode.error, err.code, err.message);
    } finally {
        // close browser
        if (browser) browser.close();
    }

    return result.bodyToString();
};
