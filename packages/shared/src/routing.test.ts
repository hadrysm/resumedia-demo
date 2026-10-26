import assert from 'node:assert/strict'
import { test } from 'node:test'

import { isValidSlug, pagePath, parsePath, type SiteRouting } from './routing.ts'

const multi: SiteRouting = { locales: ['en', 'en-GB', 'nl', 'de'], defaultLocale: 'en' }
const single: SiteRouting = { locales: ['nl'], defaultLocale: 'nl' }

test('multi-language site always prefixes, including the home page', () => {
  assert.equal(pagePath(multi, 'en', 'home'), '/en')
  assert.equal(pagePath(multi, 'nl', 'blog/how-to-write-a-cv'), '/nl/blog/how-to-write-a-cv')
  assert.equal(pagePath(multi, 'en-GB', 'pricing'), '/en-gb/pricing')
})

test('single-language site never prefixes', () => {
  assert.equal(pagePath(single, 'nl', 'home'), '/')
  assert.equal(pagePath(single, 'nl', 'blog/cv-schrijven'), '/blog/cv-schrijven')
})

test('pagePath refuses a locale the site does not serve', () => {
  assert.throws(() => pagePath(single, 'en', 'home'))
})

test('parsePath inverts pagePath for every locale and slug shape', () => {
  const slugs = ['home', 'pricing', 'blog/how-to-write-a-cv', 'resume/examples/nurse']
  for (const site of [multi, single]) {
    for (const locale of site.locales) {
      for (const slug of slugs) {
        assert.deepEqual(parsePath(site, pagePath(site, locale, slug)), { locale, slug })
      }
    }
  }
})

test('parsePath tolerates a trailing slash', () => {
  assert.deepEqual(parsePath(multi, '/nl/'), { locale: 'nl', slug: 'home' })
  assert.deepEqual(parsePath(single, '/blog/'), { locale: 'nl', slug: 'blog' })
})

test('parsePath rejects slugs deeper than three segments', () => {
  assert.equal(parsePath(single, '/a/b/c/d'), null)
  assert.equal(parsePath(multi, '/en/a/b/c/d'), null)
  assert.deepEqual(parsePath(multi, '/en/a/b/c'), { locale: 'en', slug: 'a/b/c' })
})

test('parsePath rejects a locale prefix the site does not serve', () => {
  assert.equal(parsePath(multi, '/fr/blog'), null)
  assert.equal(parsePath(multi, '/xx'), null)
})

test('a prefixed site rejects unprefixed paths, including the bare root', () => {
  assert.equal(parsePath(multi, '/blog/how-to-write-a-cv'), null)
  assert.equal(parsePath(multi, '/'), null)
})

test('the home slug is only reachable at the root', () => {
  assert.equal(parsePath(multi, '/en/home'), null)
  assert.equal(parsePath(single, '/home'), null)
})

test('slug validation accepts lowercase kebab segments only', () => {
  assert.equal(isValidSlug('blog/how-to-write-a-cv'), true)
  assert.equal(isValidSlug('Blog'), false)
  assert.equal(isValidSlug('blog//cv'), false)
  assert.equal(isValidSlug('a/b/c/d'), false)
  assert.equal(parsePath(single, '/Blog'), null)
})
