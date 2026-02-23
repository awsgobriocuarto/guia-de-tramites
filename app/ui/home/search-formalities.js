"use client";

import { useMemo, useState, useRef } from "react";
import { createAutocomplete } from "@algolia/autocomplete-core";
import Link from "next/link";
import { searchFormalitiesAction } from "@/app/lib/actions";

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
                const data = await searchFormalitiesAction(query);
                return data.slice(0, 15);
              }
              return [];
            },
          },
        ],
        ...props,
      }),
    [props],
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
