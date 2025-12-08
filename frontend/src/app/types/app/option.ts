export default interface Option {
  value: string | undefined;
  label: string | undefined;
  // Used for displaying a custom element instead of a string label
  labelElement?: JSX.Element;
  isActive?: boolean;
  // Used to make an option unselectable
  isDisabled?: boolean;
}
