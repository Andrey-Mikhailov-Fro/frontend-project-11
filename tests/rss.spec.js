// @ts-check
import { test, expect } from '@playwright/test';

test('successful scenary', async ({ page }) => {
  await page.goto('https://frontend-project-11-eight-phi.vercel.app/');
  await expect(page.getByRole('heading')).toContainText('RSS агрегатор');
  await expect(page.getByRole('main')).toContainText('Начните читать RSS сегодня! Это легко, это красиво.');
  await expect(page.getByLabel('add')).toContainText('Добавить');
  await page.getByPlaceholder('Ссылка RSS').click();
  await page.getByPlaceholder('Ссылка RSS').fill('https://lorem-rss.hexlet.app/feed');
  await page.getByLabel('add').click();
  await expect(page.getByText('RSS успешно загружен')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('RSS успешно загружен.');
  await expect(page.getByRole('heading', { name: 'Посты' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Фиды' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lorem ipsum feed for an' })).toBeVisible();
  await expect(page.getByText('This is a constantly updating')).toBeVisible();
  await page.getByTestId('3').click();
  await expect(page.locator('div').filter({ hasText: /Lorem ipsum 20[0-9]*-[0-9]*-[0-9]*[A-Z][0-9]*.[0-9]*./ })).toBeVisible();
  await expect(page.getByText('Commodo minim minim nulla')).toBeVisible();
  await expect(page.getByText('Читать полностью Закрыть')).toBeVisible();
  await page.getByPlaceholder('Ссылка RSS').click();
  await page.getByPlaceholder('Ссылка RSS').fill('https://lorem-rss.hexlet.app/feed?unit=year');
  await page.getByPlaceholder('Ссылка RSS').press('Enter');
  await expect(page.getByRole('heading', { name: 'Lorem ipsum feed for an interval of 1 years with 10 item(s)' })).toBeVisible();
  await expect(page.locator('li').filter({ hasText: 'Lorem ipsum feed for an interval of 1 years with 10 item(s)This is a constantly' }).getByRole('paragraph')).toBeVisible();
});

test('error scenary', async ({ page }) => {
  await page.goto('https://frontend-project-11-eight-phi.vercel.app/');
  await page.getByPlaceholder('Ссылка RSS').click();
  await page.getByLabel('add').click();
  await page.getByPlaceholder('Ссылка RSS').fill('https://lorem-rss.hexlet.ru');
  await page.getByLabel('add').click();
  await expect(page.getByText('Ресурс не содержит валидный')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Ресурс не содержит валидный RSS');
  await page.getByPlaceholder('Ссылка RSS').click();
  await page.getByPlaceholder('Ссылка RSS').fill('alfka;fk;');
  await page.getByLabel('add').click();
  await expect(page.getByRole('main')).toContainText('Ссылка должна быть валидным URL.');
  await page.getByPlaceholder('Ссылка RSS').click();
  await page.getByPlaceholder('Ссылка RSS').fill('https://lorem-rss.hexlet.app/feed');
  await page.getByLabel('add').click();
  await page.getByPlaceholder('Ссылка RSS').click();
  await page.getByPlaceholder('Ссылка RSS').fill('https://lorem-rss.hexlet.app/feed');
  await page.getByLabel('add').click();
  await expect(page.getByRole('main')).toContainText('RSS уже существует.');
});
