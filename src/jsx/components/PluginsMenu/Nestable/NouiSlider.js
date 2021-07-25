import React, { useEffect, useState } from 'react';

import nouislider from 'nouislider';

import { isEqual } from './utils';

const areEqual = (prevProps, nextProps) => {
   const { start, step, disabled, range } = prevProps;
   return (
      nextProps.step === step &&
      isEqual(nextProps.start, start) &&
      nextProps.disabled === disabled &&
      isEqual(nextProps.range, range)
   );
};

const Nouislider = (props) => {
   const [slider, setSlider] = useState(null);
   const sliderContainer = React.createRef();

   useEffect(() => {
      const { instanceRef } = props;
      const isCreatedRef = instanceRef && Object.prototype.hasOwnProperty.call(instanceRef, 'current');
      if (instanceRef && instanceRef instanceof Function) {
         instanceRef(sliderContainer.current);
      }

      if (isCreatedRef) {
         // eslint-disable-next-line no-param-reassign
         instanceRef.current = sliderContainer.current;
      }

      return () => {
         if (isCreatedRef) {
            // eslint-disable-next-line no-param-reassign
            instanceRef.current = null;
         }
      };
   }, [sliderContainer]);

   const clickOnPip = (pip) => {
      const value = Number(pip.target.getAttribute('data-value'));
      if (slider) {
         slider.set(value);
      }
   };

   const toggleDisable = (d) => {
      const sliderHTML = sliderContainer.current;
      if (sliderHTML) {
         if (!d) {
            sliderHTML.removeAttribute('disabled');
         } else {
            sliderHTML.setAttribute('disabled', true);
         }
      }
   };

   const updateOptions = (o) => {
      const sliderHTML = sliderContainer.current;
      sliderHTML.noUiSlider.updateOptions(o);
   };

   const setClickableListeners = () => {
      if (props.clickablePips) {
         const sliderHTML = sliderContainer.current;
         [].slice.call(sliderHTML.querySelectorAll('.noUi-value')).forEach((pip) => {
            pip.style.cursor = 'pointer';
            pip.addEventListener('click', clickOnPip);
         });
      }
   };

   const createSlider = () => {
      const { onUpdate, onChange, onSlide, onStart, onEnd, onSet } = props;
      const sliderComponent = nouislider.create(sliderContainer.current, {
         ...props,
      });

      if (onStart) {
         sliderComponent.on('start', onStart);
      }

      if (onSlide) {
         sliderComponent.on('slide', onSlide);
      }

      if (onUpdate) {
         sliderComponent.on('update', onUpdate);
      }

      if (onChange) {
         sliderComponent.on('change', onChange);
      }

      if (onSet) {
         sliderComponent.on('set', onSet);
      }

      if (onEnd) {
         sliderComponent.on('end', onEnd);
      }

      setSlider(sliderComponent);
   };

   useEffect(() => {
      const sliderHTML = sliderContainer.current;
      if (sliderHTML) {
         toggleDisable(props.disabled);
         createSlider();
      }
      return () => {
         if (slider) slider.destroy();
         if (sliderHTML) {
            [].slice.call(sliderHTML.querySelectorAll('.noUi-value')).forEach((pip) => {
               pip.removeEventListener('click', clickOnPip);
            });
         }
      };
   }, []);

   useEffect(() => {
      if (slider) {
         setClickableListeners();
      }
   }, [slider]);

   const { start, disabled, range, step } = props;

   useEffect(() => {
      if (slider) {
         updateOptions({ range, step });
         slider.set(start);
         setClickableListeners();
      }
      toggleDisable(disabled);
   }, [start, disabled, range, step]);

   const { id, className, style } = props;
   const options = {};
   if (id) {
      options.id = id;
   }
   if (className) {
      options.className = className;
   }
   return <div {...options} ref={sliderContainer} style={style} />;
};

export default React.memo(Nouislider, areEqual);
