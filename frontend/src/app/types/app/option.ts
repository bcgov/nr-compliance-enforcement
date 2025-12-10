export default interface Option {
  value: string | undefined;
  label: string | undefined;
  // Used for displaying a custom element instead of a string label
  labelElement?: JSX.Element;
  // Used to filter options from the list
  isActive?: boolean;
  // Used to make an option visible but unselectable
  isDisabled?: boolean;
}
