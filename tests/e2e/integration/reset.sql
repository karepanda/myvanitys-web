-- Idempotent data reset for the Playwright integration tests.
--
-- Deletes ONLY rows owned by the 8 seeded test users (their vanity relations and
-- reviews) and catalog products created by the suite (identified by the 'e2e-'
-- name prefix used in tests/e2e/integration/helpers.js). Flyway-seeded categories
-- and catalog products, and any non-test user data, are never touched.
--
-- FK order (from the Flyway migrations): review -> product_user (ON DELETE
-- CASCADE), product_user -> product/user, product -> category. Children first.

-- 1. Reviews on the test users' vanity relations.
DELETE FROM review
WHERE product_user_id IN (
    SELECT product_user_id
    FROM product_user
    WHERE user_id IN (
        'e2e00000-0000-4000-8000-000000000001',
        'e2e00000-0000-4000-8000-000000000002',
        'e2e00000-0000-4000-8000-000000000003',
        'e2e00000-0000-4000-8000-000000000004',
        'e2e00000-0000-4000-8000-000000000005',
        'e2e00000-0000-4000-8000-000000000006',
        'e2e00000-0000-4000-8000-000000000007',
        'e2e00000-0000-4000-8000-000000000008'
    )
);

-- 2. The test users' vanity relations.
DELETE FROM product_user
WHERE user_id IN (
    'e2e00000-0000-4000-8000-000000000001',
    'e2e00000-0000-4000-8000-000000000002',
    'e2e00000-0000-4000-8000-000000000003',
    'e2e00000-0000-4000-8000-000000000004',
    'e2e00000-0000-4000-8000-000000000005',
    'e2e00000-0000-4000-8000-000000000006',
    'e2e00000-0000-4000-8000-000000000007',
    'e2e00000-0000-4000-8000-000000000008'
);

-- 3. Catalog products created by the suite.
DELETE FROM product
WHERE name LIKE 'e2e-%';
