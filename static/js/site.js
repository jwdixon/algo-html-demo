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

function renderAssetSelect(elem, data) {
  if(data !== undefined) {
    elem.length = 0;

    if(data.length > 0) {
    // append assets
    for (var i = data.length - 1; i >= 0; i--) {
        appendSelectOption(elem,
                            data[i]['asset']['params']['name'],
                            data[i]['asset']['index']);
      }
    } else {
      appendSelectOption(elem,
                            "No assets found.",
                            -1);
    }
  }
}

function renderAccountSelect(elem, data) {
  elem.length = 0;

  if(data.length > 0) {
    // append accounts
    for (var i = data.length - 1; i >= 0; i--) {
      appendSelectOption(elem,
                          data[i].address,
                          data[i].address);
    }
  } else {
    appendSelectOption(elem,
                          "No accounts found.",
                          -1);
  }
}