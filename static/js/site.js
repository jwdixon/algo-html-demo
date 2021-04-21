function renderLoadingSelect(elem) {
  elem.disabled = true;
  elem.length = 0;

  let option = document.createElement('option');
  option.text = "Loading...";
  option.value = "-1";
  elem.appendChild(option);
}

function appendSelectOption(elem, text, value) {
  let option = document.createElement('option');
  option.text = text;
  option.value = value;
  elem.appendChild(option);
  elem.disabled = false;
}