import { HintInputWrapper } from "@/app/components/common/custom-hint";
import { FC, useRef } from "react";
import { AsyncTypeahead, UseAsyncProps } from "react-bootstrap-typeahead";

type Props = UseAsyncProps & {
  hintText?: string;
};

export const CompAsyncTypeahead: FC<Props> = ({
  hintText,
  className = "comp-select comp-details-input full-width comp-async comp-async-text",
  onChange,
  options,
  ...rest
}) => {
  const typeaheadRef = useRef<any>(null);

  return (
    <AsyncTypeahead
      ref={typeaheadRef}
      clearButton
      filterBy={() => true}
      className={className}
      options={options}
      onChange={onChange}
      onKeyDown={(e: any) => {
        if (e.key === "Enter" && options.length > 0) {
          onChange?.([options[0]]);
          typeaheadRef.current?.blur();
        }
      }}
      {...(hintText !== undefined && {
        renderInput: ({ inputRef, referenceElementRef, ...inputProps }: any) => (
          <HintInputWrapper
            hintText={hintText}
            inputProps={inputProps}
            inputRef={inputRef}
            referenceElementRef={referenceElementRef}
          />
        ),
      })}
      {...rest}
    />
  );
};
