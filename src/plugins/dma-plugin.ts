import { ExclusiveDrawerPlugin, ExclusiveDrawerPluginConstructor } from '../chart/drawer-plugin';
import { createLinePlugin, DatumColorMap, TitleBarTheme  } from './line-indicator-plugin';

export function createDMAPlugin(
  lineData: DatumColorMap[] = [
    {
      key: 'dif',
      color: '#FF8E29',
    },
    {
      key: 'ama',
      color: '#ADE3F3',
    },
  ],
  dataObjectKey = 'dma',
): ExclusiveDrawerPluginConstructor {
  return class DMAPlugin extends createLinePlugin(
    {
      dataObjectKey,
      title: 'DMA',
      lineData,
      detailMapper(key, datum, i) {
        return {
          x: i * 80 + 50,
          label: `${key.toUpperCase()}: ${datum === 0 ? 0 : datum.toFixed(2)}`,
        };
      },
    },
  ) {
    public onSetRange() {
      let minValue = Number.MAX_SAFE_INTEGER;
      let maxValue = Number.MIN_SAFE_INTEGER;
      const data = this.pluginHost.range.visible();
      const all = [
        ...data.map((item) => (item as any)[dataObjectKey].dif),
        ...data.map((item) => (item as any)[dataObjectKey].ama),
      ];
      for (let i = 0, len = all.length; i < len; ++i) {
        const v = all[i];
        if (v < minValue) {
          minValue = v;
        } else if (v > maxValue) {
          maxValue = v;
        }
      }
      this.pluginHost.minValue = minValue;
      this.pluginHost.maxValue = maxValue;
    }
  };
}
