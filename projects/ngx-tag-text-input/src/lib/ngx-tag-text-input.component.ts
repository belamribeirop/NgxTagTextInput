import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'lib-NgxTagTextInput',
  template: './ngx-tag-text-input.component.html',
  styles: [],
})
export class NgxTagTextInputComponent {
  @Input() inputLabel: string = '';
  @Input() inputValue: string = '';
  @Input() tags: string[] = [];
  @Output() inputContentEmit = new EventEmitter<string>();
  @ViewChild('childInput') childInput: ElementRef;
  @ViewChild('parentInput') parentInput: ElementRef;
  cursor?: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputValue) this.formatInputText(this.inputValue);
  }
  ngAfterViewInit(): void {
    if (this.inputValue)
      this.childInput.nativeElement.innerHTML = this.inputValue;
  }

  formatInputText(text: string) {
    this.inputValue = this.inputValue
      .replaceAll(
        '{',
        '<span contenteditable="false" class="badge badge-pill badge-primary-light pointer p-1 m-1 font-size-sm">'
      )
      .replaceAll('}', '</span>');
  }
  handleTagClick(e: any) {
    var el = e.target.cloneNode(true);
    el.classList.remove('pointer');
    el.innerText = el.innerText.trim();
    let actualValue = this.childInput.nativeElement.innerText;
    let regex = /(<([^>]+)>)/gi;
    let htmlinner = this.childInput.nativeElement.innerHTML;
    if (htmlinner.includes('</span>')) {
      let noTag = htmlinner.replace(regex, '');
      let part1 = noTag.slice(0, this.cursor!);
      let part2 = noTag.slice(this.cursor!);
      let newText = part1 + el.innerText + part2;
      for (let i = 0; i < this.tags.length; i++) {
        if (newText.includes(this.tags[i])) {
          newText = newText.replaceAll(
            this.tags[i],
            `<span contenteditable="false" class="badge badge-pill badge-primary-light pointer p-1 m-1 font-size-sm">${this.tags[i]}</span>`
          );
        }
      }
      this.childInput.nativeElement.innerHTML = newText;
    } else {
      let part1 = actualValue.slice(0, this.cursor!);
      let part2 = actualValue.slice(this.cursor!);
      this.childInput.nativeElement.innerHTML = part1 + el.outerHTML + part2;
    }
    this.changeEvent();
    this.placeCaretAtEnd(this.childInput.nativeElement);
  }

  handleCursorPosition() {
    this.preventImagePasted();
    this.cursor = this.getCaretCharacterOffsetWithin(
      this.childInput.nativeElement
    );
    this.changeEvent();
  }

  getCaretCharacterOffsetWithin(element: any) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != 'undefined') {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != 'Control') {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  preventImagePasted() {
    let inputText = this.childInput.nativeElement.innerHTML;
    if (inputText.indexOf('<img') != -1) {
      inputText = inputText.substring(0, inputText.indexOf('<img'));
      this.childInput.nativeElement.innerHTML = inputText;
      this.placeCaretAtEnd(this.childInput.nativeElement);
    }
  }

  changeEvent() {
    let inputText = this.childInput.nativeElement.innerHTML
      .replaceAll(
        '<span contenteditable="false" class="badge badge-pill badge-primary-light pointer p-1 m-1 font-size-sm">',
        '{'
      )
      .replaceAll('</span>', '}')
      .replace(/(\r\n|\n|\r)/gm, '');

    inputText = inputText.replace('&nbsp;', '');
    this.inputContentEmit.emit(inputText);
  }

  placeCaretAtEnd(el: any) {
    el.focus();
    if (
      typeof window.getSelection != 'undefined' &&
      typeof document.createRange != 'undefined'
    ) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }
}
