# Improving Accessibility with ArcGIS Online Web Apps

- Kelly Hutchins  
- Tao Zhang

## What is accessibility?

Make content usable for everyone regardless of abilities.

## Why is accessibility important?

- The ADA and Section 508
- People with different abilities should have equal access
- Good accessibility is good user experience

## Accessibility presentations at DevSummit

- DIY Accessibility. Wednesday, March 6. 5:30pm - 6:30pm.
- Accessible Web Mapping Apps. Thursday, March 7. 9am - 10am.
- Improving Accessibility with ArcGIS Online Web Apps. Thursday, March 7. 2:30pm - 3:00pm

## What we will cover today

- Test accessibility
- Fix accessibility issues
- How to learn more

## Demo app

Link: https://arcg.is/1O5u09

Note:

- We will run axe to check for accessibility issues of the app.
- We will also do a keyboard test to identify focus and tab order issues.
- We will go over the issues and discuss related accessibility best practices.

## Color contrast

- [WCAG 1.4.3](http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html): Text needs to have contrast ratio of at least 4.5:1.
- [Contrast ratio](https://contrast-ratio.com/)
- [Color cube](https://oomphinc.github.io/colorcube/)
- Color picker in Chrome DevTools.

## Alternate text

- [WCAG 1.1.1](https://www.w3.org/TR/UNDERSTANDING-WCAG20/text-equiv-all.html): Non-text content has text alternative. If image is decorative, use `alt=""`.

## Write effective alternate text

- Think about how users will be doing with the information
- Be accurate in presenting the content in images
- Be succinct
- No need to use the phrase "image of ..." to describe images

## Alternate text demo

- [Text alternative - empty alt](https://developers.arcgis.com/javascript/latest/sample-code/widgets-basemapgallery/live/index.html)
- [Text alternative - descriptive](https://story.maps.arcgis.com/apps/MapJournal/index.html?appid=2b1c793f464b4cd2944a0b9700c0dc48)

## Landmark

Best practice: use Both HTML 5 Elements and ARIA Landmarks in the Same Element.

| HTML     | ARIA Role          |
|----------|--------------------|
| <header> | role="banner"      |
| <nav>    | role="navigation"  |
| <main>   | role="main"        |
| <footer> | role="contentinfo" |

Reference: [Accessible Landmarks](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

## Focus and tab order

- [WCAG 2.4.7](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-visible.html): Interactive elements should have clear focus.
- [WCAG 1.3.2](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-sequence.html): Navigation (tab) order should be logical and intuitive.
- [WCAG 2.1.1](https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-keyboard-operable.html): Keyboard users should be able to use functionalities using keyboard only.
- [WCAG 2.1.2](http://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-trapping.html): Content does not "trap" keyboard focus within subsections.

## Focus

Don't do this:

```css
*:focus {
    outline: 0;
}
```

Use the browser's default focus styling or implement custom focus style for interactive elements.

## Tab order

Tab order should match intended reading order.

- `tabindex="0"`: let DOM structure determine focus order.
- `tabindex="-1"`: necessary for programmatically moving focus (e.g., error message, menus, radio buttons, etc.)
- `tabindex="3"`: anti-pattern.

## The `<button>` element

When you use `<button>` element for clickable buttons and bind click event listeners to those buttons, you get a lot of functionality for free:

- Buttons are automatically focusable.
- Screen readers will announce the button in focus and offer ways to click the button.
- Space and Enter keys are automatically supported when binding a click event listener to a button.

## Semantic HTML

Semantics: Choose the right HTML element to reflect content structure and meaning.

`<div>` and `<span>` are semantically neutral. It is significantly more work to polyfill the missing semantic information and expected behavior.

## Dialog

- When a dialog opens, focus moves to an element inside the dialog.
- Focus should be "trapped" inside the dialog until the dialog is dismissed.
- Focus should return to the element that opens the dialog.

Reference: [ARIA Best Practices - Dialog](http://w3c.github.io/aria-practices/#dialog_modal)