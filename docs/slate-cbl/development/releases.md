# Making a Release

1. Open a pull request using the `releases/v2` branch as a base (the branch being merged *into*) and the `develop` branch as the compared branch (the branch being merged *from*)
2. Title the pull request in the format `Release: slate-cbl vX.Y.Z`, following semantic versioning practices:

   - Increment only the patch number (Z) for bug fixes or minor improvements that do not change expected functionality
   - Increment the minor release number (Y) and reset the patch number (Z) to zero if new features are being added or other changes made that a typical user would want to automatically upgrade to
   - Increment the major release number (X) and reset the other numbers when changes are so significant that an automatic upgrade is not possible, or would not be desirable for typical users

3. Outline with markdown bullet points in the pull request's description the changes made in the release as the will manifest from a user's perspective. This outline serves as a draft for the release notes which may ultimately be presented to end users to prepare them for changes in their experience.
4. Review the "Files changed" tab in GitHub for any unexpected changes or changes that are not yet described by the release notes.
5. Ensure that all status checks for builds and tests are successful
6. Merge the pull request
7. [Create a new release](https://github.com/SlateFoundation/slate-cbl/releases/new)

   - For *Tag version* input the designated release version from the pull request in the format `vX.Y.Z` (include the `v` prefix)
   - For *Target* select the `releases/v2` branch
   - For *Release title* input the project name and version in the format `slate-cbl vX.Y.Z` (matching the pull request title, but without the `Release:` prefix)
   - For *Describe this release*, copy the bullet point release notes drafted in the pull request
   - Click *Publish release*
