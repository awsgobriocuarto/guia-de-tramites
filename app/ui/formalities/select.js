"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Select({
  data = [],
  collection = "ninguna",
  placeholder = "Elegir",
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleSelect = (value) => {
    if (value && value != "") {
      params.set(collection, value);
    } else {
      params.delete(collection);
    }
    replace(`${pathname}?${params.toString()}`);
  };
  //console.log(collection);
  return (
    <div>
      <select
        className="form-select"
        onChange={(event) => handleSelect(event.target.value)}
        defaultValue={searchParams.get(collection)?.toString()}
      >
        <option value="">{placeholder}</option>
        {data?.map((item) => (
          <option value={item.slug} key={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
