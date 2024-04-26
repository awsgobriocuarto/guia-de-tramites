"use client";

import { useMemo, useState, useRef } from "react";
import { createAutocomplete } from "@algolia/autocomplete-core";
import Link from "next/link";

const API_URL = "https://admin.tramitesdev.riocuarto.gob.ar";
const API_TOKEN = "Bearer 1|Dn58lwU4vJcuXXSMtdAyYBhyc5NZyRXWZFNgMney";
const API_OPTIONS = {
  headers: {
    Authorization: API_TOKEN,
  },
  cache: "no-store",
};

const AutocompleteItem = ({ title, slug }) => {
  return (
    <li>
      <Link href={`/tramites/${slug}`}>{title}</Link>
    </li>
  );
};

const SearchFormalities = (props) => {
  const [autocompleteState, setAutocompleteState] = useState({
    collections: [],
    isOpen: false,
  });

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        placeholder: "Buscar un trámite...",
        onStateChange: ({ state }) => setAutocompleteState(state),
        getSources: () => [
          {
            sourceId: "formalities-next-api",
            getItems: async ({ query }) => {
              if (!!query) {
                const response = await fetch(
                  `${API_URL}/api/tramites?search=${query}`,
                  API_OPTIONS
                );
                if (!response.ok) {
                  throw new Error("Error al obtener los datos");
                }
                const data = await response.json();
                return data.slice(0, 15);
              }
              return [];
            },
          },
        ],
        ...props,
      }),
    [props]
  );

  const formRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const formProps = autocomplete.getFormProps({
    inputElement: inputRef.current,
  });
  const inputProps = autocomplete.getInputProps({
    inputElement: inputRef.current,
  });

  return (
    <form ref={formRef} {...formProps} className="search">
      <div className="input-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Buscar tramites"
          ref={inputRef}
          {...inputProps}
        />
      </div>
      <div>
        {autocompleteState.isOpen && (
          <div
            className="response"
            ref={panelRef}
            {...autocomplete.getPanelProps()}
          >
            {autocompleteState.collections.map((collection, index) => {
              const { items } = collection;
              return (
                <section key={`section-${index}`}>
                  {items.length > 0 && (
                    <ul {...autocomplete.getListProps()}>
                      {items.map((item) => (
                        <AutocompleteItem key={item.id} {...item} />
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchFormalities;
