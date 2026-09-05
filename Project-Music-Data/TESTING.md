# Testing

## Rubric 1 — Website has a dropdown listing four users

The website creates a dropdown using the user IDs returned by `getUserIDs()`.

The dropdown is populated in `script.mjs`.

The four users are listed as options in the dropdown.

## Rubric 2 — Selecting a user displays answers relevant to that user

When a user is selected from the dropdown, the change event calls `renderResults(userID)`.

The results are calculated using the selected user's listening data.

Different users therefore receive answers based on their own data.

## Rubric 3 — Calculations work with different data and handle edge cases

The calculation functions use the data returned by `getListenEvents()` and `getSong()` rather than hard-coded answers.

The code handles users with no listening data.

User 4 has no listening events, so the website displays an intelligible message instead of trying to calculate results.

Questions that do not apply to a user are hidden rather than displaying an empty result.

The top genres heading changes depending on how many genres are available. For example, one genre is displayed as "Top genre" rather than "Top 3 genres".

## Rubric 4 — Unit tests

Unit tests are in `script.test.mjs`.

The tests check the calculation functions used by `script.mjs`, including results for different users and edge cases.

The tests are run using:

```bash
npm test
```

All tests pass.

## Rubric 5 — Accessibility

The website uses semantic HTML and includes a label for the user dropdown.

The results section uses `aria-live="polite"` so that updated results can be announced to assistive technologies.

Lighthouse is used to check the accessibility of the website.

The target accessibility score is 100.

## Question 1 — Most listened-to song

Tests in `script.test.mjs` check the most listened-to song by number of listens and by total listening time.

## Question 2 — Most listened-to artist

Tests in `script.test.mjs` check the most listened-to artist by number of listens and by total listening time.

## Question 3 — Friday-night listening

Tests in `script.test.mjs` check the most listened-to song on Friday night by number of listens and by total listening time.

The tests also check the case where a user has no Friday-night listening data.

## Question 4 — Listening time

Tests in `script.test.mjs` check results based on total listening time.

## Question 5 — Longest listening streak

Tests in `script.test.mjs` check the longest sequence of consecutive listens to the same song.

The tests include the expected results for the users with listening data.

## Question 6 — Songs listened to every day

Tests in `script.test.mjs` check which songs were listened to on every day in the user's listening data.

The tests also check the case where there are no everyday songs.

## Question 7 — Top genres

Tests in `script.test.mjs` check the top genres for different users.

The tests include cases with three genres and a case where only one genre applies.

## Test command

The tests can be run from the `Project-Music-Data` directory with:

```bash
npm test
```

Current result:

```text
All Music Data tests passed!
```
