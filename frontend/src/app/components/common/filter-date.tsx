import { FC } from "react";
import DatePicker from "react-datepicker";

interface Props {
  id: string;
  label: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  handleDateChange: (dates: [Date, Date]) => void;
}

export const FilterDate: FC<Props> = ({ id, label, startDate, endDate, handleDateChange }) => {
  // manual entry of date change listener.  Looks for a date range format of {yyyy-mm-dd} - {yyyy-mm-dd}
  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value?.includes(" - ")) {
      const [startDateStr, endDateStr] = e.target.value.split(" - ");
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        // Invalid date format
        return [null, null];
      } else {
        //  add 1 to date because days start at 0
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        handleDateChange([startDate, endDate]);
      }
    }
    return [null, null];
  };

  return (
    <div id={id}>
      <label htmlFor="date-range-picker-id">{label}</label>
      <div className="filter-select-padding">
        <div
          className="d-flex comp-form-control align-items-center"
          style={{ padding: "5px 10px" }}
        >
          <i className="bi bi-calendar" />
          <DatePicker
            id={`date-range-picker-${id}`}
            showIcon={false}
            renderCustomHeader={({ monthDate, customHeaderCount, decreaseMonth, increaseMonth }) => (
              <div>
                <button
                  aria-label="Previous Month"
                  className={`react-datepicker__navigation react-datepicker__navigation--previous ${
                    customHeaderCount === 1 ? "datepicker-nav-hidden" : "datepicker-nav-visible"
                  }`}
                  onClick={decreaseMonth}
                >
                  <span
                    className={
                      "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous datepicker-nav-icon"
                    }
                  >
                    {"<"}
                  </span>
                </button>
                <span className="react-datepicker__current-month">
                  {monthDate.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  aria-label="Next Month"
                  className={`react-datepicker__navigation react-datepicker__navigation--next ${
                    customHeaderCount === 1 ? "datepicker-nav-hidden" : "datepicker-nav-visible"
                  }`}
                  onClick={increaseMonth}
                >
                  <span
                    className={
                      "react-datepicker__navigation-icon react-datepicker__navigation-icon--next datepicker-nav-icon"
                    }
                  >
                    {">"}
                  </span>
                </button>
              </div>
            )}
            selected={startDate}
            onChange={handleDateChange}
            onChangeRaw={handleManualDateChange}
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            monthsShown={2}
            selectsRange={true}
            isClearable={true}
            wrapperClassName="comp-filter-calendar-input"
            showPreviousMonths
            maxDate={new Date()}
          />
        </div>
      </div>
    </div>
  );
};
