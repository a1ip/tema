export function fillGrid ({ elem, data, stepsQuantity }) {
  elem.innerHTML = '';
  let index = 0;

  for (const colorData of data) {
    let lineClass = '';
    if (index === 0) {
      lineClass = 'palette__cell--first-line';
    } else if (index === data.length - 1) {
      lineClass = 'palette__cell--last-line';
    }
    const colorsCells = colorData
      .map(({ name, hsl, color, isBase, isKeyword, isEdgeValue }) => {
        const classList = ['palette__cell'];
        let content = `<span class="palette__cell-content">${name}</span>`;
        const { l } = hsl;

        if (isBase) {
          classList.push('palette__cell--base');

          if (lineClass) {
            classList.push(lineClass);
          }
        }

        if (isKeyword) {
          classList.push('palette__cell--keyword');
        }

        if (l < 25) {
          classList.push('palette__cell--dark');
        }

        if (isEdgeValue) {
          classList.push('palette__cell--no-color');
          color = 'transparent';
          content = '';
        }

        return `<span
          class="${classList.join(' ')}"
          style="background-color: ${color}">${content}</span>`;
      });

    elem.insertAdjacentHTML('beforeend', colorsCells.join(''));
    index++;
  }

  elem.style.setProperty('--columns', stepsQuantity * 2 + 1);
}
