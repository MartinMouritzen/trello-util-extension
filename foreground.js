let keyupTimeoutId = false;

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
function processCards() {
	const board = document.querySelectorAll('#board')[0];

	if (board) {
		const columns = board.querySelectorAll(':scope > li');	

		if (columns && columns.length > 0) {
			columns.forEach((column) => {
				const cardContainers = column.querySelectorAll('li');

				if (cardContainers && cardContainers.length > 0) {
					cardContainers.forEach((cardContainer) => {
						const card = cardContainer.querySelector(':scope > div');
						const contentDiv = card.querySelector(':scope > div');
						
						if (contentDiv) {
							const labels = card.querySelectorAll('span[data-testid="compact-card-label"]');

							var colors = [];
							labels.forEach((label) => {
								label.style.boxShadow = '1px 1px 3px 0px rgba(0,0,0,0.15)';

								if (label['type'] == 'button') {
									return;
								}

								const computedStyle = window.getComputedStyle(label);
								colors.push(computedStyle.backgroundColor);
							});
							// Let's try only picking the first color
							colors = colors[0] ? [colors[0]] : colors;
							if (colors.length > 0) {
								const textElement = contentDiv.querySelector('a');
								const textColor = getContrastingTextColor(colors[0]);

								textElement.style.color = textColor;
								if (textColor == 'white') {
									textElement.style.textShadow = '0px 1px 0px rgba(0,0,0,0.2)';
								}

								if (colors.length == 1) {
									card.style.background = colors[0];
								}
								if (colors.length > 1) {
									const gradientString = `linear-gradient(to bottom right, ${colors.join(', ')})`;
									// const stripeWidthValue = 100 / colors.length; // Calculate the width of each stripe as a number
									// const gradientString = `repeating-linear-gradient(to bottom right, ${colors.map((color, index) => `${color} ${index * stripeWidthValue}%, ${color} ${(index + 1) * stripeWidthValue}%`).join(', ')})`
									card.style.background = gradientString;
								}
							}
							else {
								card.style.background = '#ffffff';
							}
						}
					});
				}
			});
		}
	}
}
window.onload = () => {
	document.addEventListener('keyup',() => {
		clearTimeout(keyupTimeoutId);
		keyupTimeoutId = setTimeout(() => {
			processCards();
		},250);
	});
}

const observer = new MutationObserver((mutations) => {
	processCards();
});

const targetNode = document.body; // getElementById('board');
observer.observe(targetNode, { childList: true });