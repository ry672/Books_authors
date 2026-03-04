import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { useGetCategoryQuery } from "../store/Api/CategoryApi";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name?: Path<T>;
};

export function LabelCategories<T extends FieldValues>({ control, name }: Props<T>) {
  const { data: categories, isLoading } = useGetCategoryQuery({});

  if (isLoading) return <div>Loading...</div>;

  return (
    <Controller
      name={(name ?? "categoryId") as Path<T>}
      control={control}
      rules={{ required: "Select category" }}
      render={({ field, fieldState }) => (
        <div>
          <select
            value={field.value ?? ""}                 
            onChange={(e) => field.onChange(Number(e.target.value))}
          >
            <option value="" disabled>
              Select category
            </option>

            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {fieldState.error?.message && (
            <p style={{ color: "red" }}>{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}