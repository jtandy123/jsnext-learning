function copy(ele) {
    const range = document.createRange();
    const end = ele.childNodes.length;
    range.setStart(ele, 0);
    range.setEnd(ele, end);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy', false, null);
    selection.removeRange(range);
}
