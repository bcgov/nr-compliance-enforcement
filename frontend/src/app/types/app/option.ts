export default interface Option {
  value: string | undefined;
  label: string | undefined;
  // Used for displaying a custom element instead of a string label
  labelElement?: JSX.Element;
  // Used to filter options from the list
  isActive?: boolean;
  // Used to make an option visible but unselectable
  isDisabled?: boolean;
  // Used to style an option as a header while still being selectable
  isHeader?: boolean;
  // Renders as a plain, non-interactive divider row - bypasses react-select's Option wrapper
  // entirely so it never gets hover/focus/selected background styling
  isSeparator?: boolean;
  // CSS class applied to a separator row (ignored otherwise)
  className?: string;
}
