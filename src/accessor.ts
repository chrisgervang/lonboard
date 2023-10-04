import * as arrow from "apache-arrow";
import { parseParquet } from "./parquet";
import { useState, useEffect } from "react";

export function useTableBufferState(
  wasmReady: boolean,
  dataRaw: DataView
): [arrow.Table | null] {
  const [dataTable, setDataTable] = useState<arrow.Table | null>(null);
  // Only parse the parquet buffer when the data itself or wasmReady has changed
  useEffect(() => {
    const callback = () => {
      if (wasmReady && dataRaw && dataRaw.byteLength > 0) {
        setDataTable(parseParquet(dataRaw));
      }
    };
    callback();
  }, [wasmReady, dataRaw]);

  return [dataTable];
}

export function useAccessorState(wasmReady: boolean, accessorRaw: any): any {
  const [accessorValue, setAccessorValue] = useState(null);

  // Only parse the parquet buffer when the data itself or wasmReady has changed
  useEffect(() => {
    const callback = () => {
      setAccessorValue(
        accessorRaw instanceof DataView
          ? wasmReady && accessorRaw.byteLength > 0
            ? parseParquet(accessorRaw).getChildAt(0)
            : null
          : accessorRaw
      );
    };
    callback();
  }, [wasmReady, accessorRaw]);

  return [accessorValue];
}
