module.exports = {
    getSlidersRatingSelector: (sliders) => {
        const firstSlider = sliders[0];
        const { minRating, maxRating } = firstSlider.getConfig();
        const visibleRatings = Array.from({length: maxRating - minRating + 1 }, (_, i) => i + minRating)
        const totalThumbs = visibleRatings.length;
        const ratingWidth = firstSlider.innerEl.getWidth() / totalThumbs;

        return (slider, rating) => {
            const selectedRatingPos = visibleRatings.indexOf(rating);
            cy.wrap(slider.innerEl.dom)
                .click({
                    x: ratingWidth * (selectedRatingPos + 1),
                    y: 5,
                    force: true
                });
        };
    }
};
