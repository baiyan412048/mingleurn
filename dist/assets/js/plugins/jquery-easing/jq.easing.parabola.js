/*
 * jQuery Easing v1.0 - https://github.com/hevyweb/jq.easing.parabola
 *
 * jQuery easing in a form of parabola
 *
*/

jQuery.extend(jQuery.easing,
    {
        /**
         * Change data according to the parabola formula.
         *
         * @param timeDelta is time/duration
         * @param time milliseconds from the start of the animation. Not is use.
         * @param initialValue initial value
         * @param delta difference between final value and initial value
         * @param duration time in milliseconds - animation duration. Not is use.
         * @returns number
         */
        parabola: function (timeDelta, time, initialValue, delta, duration) {
            return initialValue + delta * Math.sqrt(1 - Math.pow((2 * timeDelta - 1), 2));
        }
    });