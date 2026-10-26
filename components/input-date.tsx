"use client";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import _ from "lodash";
import { CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function InputDate({
  name,
  defaultValue: _defaultValue,
  ...props
}: React.ComponentProps<"input">) {
  const [selected, setSelected] = useState<Date>();
  const [month, setMonth] = useState<Date>();
  const [value, setValue] = useState<string>();
  const [valueFormatted, setValueFormatted] = useState<string>();
  const [open, setOpen] = useState(false);

  const defaultValue = String(_defaultValue ?? "");

  const handleChangeText = useCallback((value: string) => {
    const parsed = parse(value, "dd/MM/yyyy", new Date());

    if (isValid(parsed)) {
      setSelected(parsed);
    }
  }, []);

  useEffect(() => {
    if (selected && isValid(selected)) {
      setValue(formatDate(selected, "yyyy-MM-dd"));
      setValueFormatted(formatDate(selected, "dd/MM/yyyy"));
      setMonth(selected);
    } else {
      setValue("");
      setValueFormatted("");
    }

    setOpen(false);
  }, [selected]);

  useEffect(() => {
    if (defaultValue) {
      setSelected(parse(defaultValue, "yyyy-MM-dd", new Date()));
    }
  }, [defaultValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <InputGroup className="max-w-48">
        <input
          type="hidden"
          name={name}
          key={`date-${value}`}
          defaultValue={value}
        />
        <InputGroupInput
          onBlur={(ev) => handleChangeText(ev.target.value)}
          defaultValue={valueFormatted}
          key={`date-formatted-${valueFormatted}`}
          {...props}
        />
        <InputGroupAddon align={`inline-end`}>
          <PopoverTrigger
            render={
              <InputGroupButton>
                <CalendarIcon />
              </InputGroupButton>
            }
          ></PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
      <PopoverContent align="end" className={"w-auto p-0"}>
        {/* {defaultValue} */}
        <Calendar
          month={month}
          onMonthChange={setMonth}
          locale={ptBR}
          mode="single"
          selected={selected}
          onSelect={setSelected}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
