import type {Data, SensorDescriptor} from '@dnd-kit/abstract';
import {Draggable, KeyboardSensor, PointerSensor} from '@dnd-kit/dom';
import type {DragDropManager, DraggableInput} from '@dnd-kit/dom';

import {useDndContext} from '../context';
import {useComputed, useConstant, useIsomorphicLayoutEffect} from '../hooks';
import {getCurrentValue, type RefOrValue} from '../utilities';

export interface UseDraggableInput<T extends Data = Data>
  extends DraggableInput<T> {
  activator?: RefOrValue<Element>;
  element: RefOrValue<Element>;
  sensors?: SensorDescriptor<DragDropManager>[];
}

const defaultSensors: SensorDescriptor<DragDropManager>[] = [
  {sensor: PointerSensor},
  {sensor: KeyboardSensor},
];

export function useDraggable<T extends Data = Data>(
  input: UseDraggableInput<T>
) {
  const manager = useDndContext();
  const {disabled, sensors = defaultSensors} = input;
  const draggable = useConstant(() => new Draggable(input));
  const activator = getCurrentValue(input.activator);
  const element = getCurrentValue(input.element);
  const isDragging = useComputed(() => {
    const {dragOperation} = manager;

    return dragOperation.source?.id === draggable.id;
  });

  useIsomorphicLayoutEffect(() => {
    draggable.activator = activator;
    draggable.element = element;
  }, [activator, element]);

  useIsomorphicLayoutEffect(() => {
    const {registry} = manager;
    const unregister = registry.register(draggable);

    return () => {
      unregister();
      draggable.destroy();
    };
  }, [manager]);

  useIsomorphicLayoutEffect(() => {
    const unbindFunctions = sensors.map(({sensor}) => {
      const sensorInstance =
        manager.sensors.get(sensor) ?? manager.sensors.register(sensor);

      const unbind = sensorInstance.bind(draggable, manager);
      return unbind;
    });

    return function cleanup() {
      unbindFunctions.forEach((unbind) => unbind());
    };
  }, [sensors, manager, draggable]);

  useIsomorphicLayoutEffect(() => {
    draggable.disabled = Boolean(disabled);
  }, [disabled]);

  return {
    get isDragging() {
      return isDragging.value;
    },
  };
}
