# 🧪 Markdown Test Document

## 1. Headings

# H1
## H2
### H3
#### H4
##### H5
###### H6

---

## 2. Emphasis

*Italic*  
_Italic_  
**Bold**  
__Bold__  
***Bold & Italic***  
~~Strikethrough~~

---

## 3. Lists

### Unordered List
- Item A
  - Subitem A1
    - Subitem A1a
- Item B

### Ordered List
1. First
2. Second
   1. Subsecond
   2. Subsecond
3. Third

---

## 4. Links

[Inline Link](https://www.example.com)  
[Reference Link][ref]

[ref]: https://www.example.com "Example Site"

---

## 5. Images

![Alt text](https://via.placeholder.com/150 "Optional Title")

---

## 6. Code

### Inline Code
Use the `printf()` function.

### Code Block (fenced)
```python
def hello(name):
    print(f"Hello, {name}!")

Code Block (indented)

for i in range(5):
    print(i)
```
## 7. Blockquote

> This is a blockquote.
> It can span multiple lines.

>> This is a nested blockquote.
>> It can also include **formatting**, like *italic* or `inline code`.

> You can also include lists:
> - Item one
> - Item two

---

## 8. Horizontal Rule

---

___

***

---

## 9. Tables

| Name     | Age | City           |
|----------|-----|----------------|
| Alice    | 24  | New York       |
| Bob      | 30  | San Francisco  |
| **Total**|     | *2 entries*    |

---

## 10. Task Lists

- [x] Write unit tests
- [ ] Fix rendering bug
- [ ] Push to GitHub

---

## 11. HTML in Markdown

<div style="color: blue; border: 1px solid #ccc; padding: 5px;">
  <strong>This is an HTML block inside Markdown.</strong><br>
  It should render properly if HTML is supported.
</div>

---

## 12. Escaping Characters

Escape special characters like:

\* asterisk  
\_ underscore  
\` backtick  
\# hash  
\\ backslash

---

## 13. Footnotes

You can add footnotes like this.[^note]

[^note]: This is the footnote content.

---

## 14. Math (LaTeX-style)

Inline math:  
$e^{i\pi} + 1 = 0$

Block math:

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

---

## 15. Definition List (if supported)

**Markdown**  
: A lightweight markup language.  
**Renderer**  
: A program that converts markdown to HTML.

---