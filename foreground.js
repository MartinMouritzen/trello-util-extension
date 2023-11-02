var timesTriedInit = 0;

function isRGBFormat(str) {
    const rgbPattern = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
    return rgbPattern.test(str);
}
function rgbToHex(rgbString) {
    // Extract the numbers from the RGB string
    let matches = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (!matches) {
        return null; // Invalid RGB string
    }

    // Convert each number to HEX and pad with 0 if necessary
    let hexValue = (number) => {
        let hex = parseInt(number, 10).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return "#" + hexValue(matches[1]) + hexValue(matches[2]) + hexValue(matches[3]);
}
function getContrastingTextColor(hexColor) {
	if (isRGBFormat(hexColor)) {
		hexColor = rgbToHex(hexColor);
	}

    // Convert the hex color to RGB values
    let r = parseInt(hexColor.substring(1, 3), 16);
    let g = parseInt(hexColor.substring(3, 5), 16);
    let b = parseInt(hexColor.substring(5, 7), 16);

    // Calculate the brightness of the color
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black or white based on the brightness
    return brightness > 150 ? 'black' : 'white';
}
function init() {
	var shouldRetry = true;
	var board = document.querySelectorAll('#board')[0];

	if (board) {
		var columns = board.querySelectorAll(':scope > li');	

		if (columns && columns.length > 0) {
			columns.forEach((column) => {
				var cardContainers = column.querySelectorAll('li');

				if (cardContainers && cardContainers.length > 0) {
					shouldRetry = false;

					cardContainers.forEach((cardContainer) => {
						var card = cardContainer.querySelector(':scope > div');
						var contentDiv = card.querySelector(':scope > div');
						
						if (contentDiv) {
							var labels = contentDiv.querySelectorAll('button');

							var colors = [];
							labels.forEach((label) => {
								label.style.boxShadow = '1px 1px 3px 0px rgba(0,0,0,0.15)';
								if (label.innerText) {
									var computedStyle = window.getComputedStyle(label);
									colors.push(computedStyle.backgroundColor);
								}
							});
							if (colors.length > 0) {
								var textElement = contentDiv.querySelector('a');
								let textColor = getContrastingTextColor(colors[0]);

								textElement.style.color = textColor;
								if (textColor == 'white') {
									textElement.style.textShadow = '0px 1px 0px rgba(0,0,0,0.2)';
								}

								if (colors.length == 1) {
									card.style.backgroundColor = colors[0];
								}
								if (colors.length > 1) {
									const gradientString = `linear-gradient(to bottom right, ${colors.join(', ')})`;
									card.style.background = gradientString;
								}
							}
						}
					});
				}
			});
		}
	}
	if (shouldRetry) {
		timesTriedInit++;
		if (timesTriedInit < 10000) {
			setTimeout(() => {
				init();
			},250);
		}
	}
}
init();