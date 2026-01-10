import { type BaseRecord, type CrudOperators, type HttpError } from "@refinedev/core";
import type { UseTableReturnType } from "@refinedev/react-table";
import type { Column, Table as ReactTable } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import type { Button } from "~/components/core/button";

export type TableFilterDropdownProps<TData> = {
    column: Column<TData>;
    contentClassName?: string;
    triggerClassName?: string;
    children: (args: {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }) => React.ReactNode;
};

export type TableFilterOperatorSelectProps = {
    value: CrudOperators;
    onValueChange: (value: CrudOperators) => void;
    operators?: CrudOperators[];
    placeholder?: string;
    triggerClassName?: string;
    contentClassName?: string;
};

export type TableFilterDropdownActionsProps = {
    className?: string;
    isClearDisabled?: boolean;
    isApplyDisabled?: boolean;
    onClear: () => void;
    onApply: () => void;
};

export type TableFilterDropdownTextProps<TData> = {
    column: Column<TData>;
    table: ReactTable<TData>;
    defaultOperator?: CrudOperators;
    operators?: CrudOperators[];
    placeholder?: string;
};

export type TableFilterDropdownNumericProps<TData> = {
    column: Column<TData>;
    table: ReactTable<TData>;
    defaultOperator?: CrudOperators;
    operators?: CrudOperators[];
    placeholder?: string;
};

export type TableFilterComboboxProps<TData> = {
    column: Column<TData>;
    table?: ReactTable<TData>;
    options: { label: string; value: string }[];
    defaultOperator?: CrudOperators;
    operators?: CrudOperators[];
    placeholder?: string;
    noResultsText?: string;
    multiple?: boolean;
};

export type TableFilterDropdownDateSinglePickerProps<TData> = {
    column: Column<TData>;
    defaultOperator?: CrudOperators;
    formatDate?: (date: Date | undefined) => string | undefined;
};

export type TableFilterDropdownDateRangePickerProps<TData> = {
    column: Column<TData>;
    defaultOperator?: CrudOperators;
    formatDateRange?: (dateRange: DateRange | undefined) => string[] | undefined;
};

export type TableFilterInputProps<TData> = {
    column: Column<TData>;
    table?: ReactTable<TData>;
    defaultOperator?: CrudOperators;
    operators?: CrudOperators[];
    renderInput: (props: {
        value: string | string[];
        onChange: (value: string | string[]) => void;
    }) => React.ReactNode;
};

export type TablePaginationProps = {
  currentPage: number;
  pageCount: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  total?: number;
};

export type TableSorterProps<TData> = {
  column: Column<TData>;
} & React.ComponentProps<typeof Button>;


export type TableProps<TData extends BaseRecord> = {
    table: UseTableReturnType<TData, HttpError>;
};