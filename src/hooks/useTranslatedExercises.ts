import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { exercises as baseExercises } from '../data/exercises';
import { Exercise } from '../models/types';

/**
 * Converts exercise ID (kebab-case) to translation key (camelCase)
 * e.g., 'cat-cow' -> 'catCow', 'thread-needle' -> 'threadNeedle'
 */
export const exerciseIdToTranslationKey = (id: string): string => {
  return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Hook that returns exercises with translated text properties
 * based on the current language setting
 */
export const useTranslatedExercises = () => {
  const { t } = useTranslation();

  const exercises = useMemo(() => {
    return baseExercises.map((exercise): Exercise => {
      const key = exerciseIdToTranslationKey(exercise.id);
      const translationBase = `exercises.${key}`;

      // Get translated arrays, fallback to original if not found
      const translatedInstructions = t(`${translationBase}.instructions`, { 
        returnObjects: true,
        defaultValue: exercise.instructions 
      });
      const translatedProTips = t(`${translationBase}.proTips`, { 
        returnObjects: true,
        defaultValue: exercise.proTips 
      });
      const translatedBenefits = t(`${translationBase}.benefits`, { 
        returnObjects: true,
        defaultValue: exercise.benefits 
      });

      return {
        ...exercise,
        name: t(`${translationBase}.name`, { defaultValue: exercise.name }),
        description: t(`${translationBase}.description`, { defaultValue: exercise.description }),
        instructions: Array.isArray(translatedInstructions) ? translatedInstructions : exercise.instructions,
        proTips: Array.isArray(translatedProTips) ? translatedProTips : exercise.proTips,
        benefits: Array.isArray(translatedBenefits) ? translatedBenefits : exercise.benefits,
      };
    });
  }, [t]);

  return exercises;
};

/**
 * Hook that returns a single translated exercise by ID
 */
export const useTranslatedExercise = (id: string): Exercise | undefined => {
  const exercises = useTranslatedExercises();
  return useMemo(() => exercises.find(e => e.id === id), [exercises, id]);
};

/**
 * Hook that translates a single exercise object
 * Useful when you have an exercise from the routine that needs translation
 */
export const useExerciseTranslation = () => {
  const { t } = useTranslation();

  const translateExercise = useMemo(() => {
    return (exercise: Exercise): Exercise => {
      const key = exerciseIdToTranslationKey(exercise.id);
      const translationBase = `exercises.${key}`;

      const translatedInstructions = t(`${translationBase}.instructions`, { 
        returnObjects: true,
        defaultValue: exercise.instructions 
      });
      const translatedProTips = t(`${translationBase}.proTips`, { 
        returnObjects: true,
        defaultValue: exercise.proTips 
      });
      const translatedBenefits = t(`${translationBase}.benefits`, { 
        returnObjects: true,
        defaultValue: exercise.benefits 
      });

      return {
        ...exercise,
        name: t(`${translationBase}.name`, { defaultValue: exercise.name }),
        description: t(`${translationBase}.description`, { defaultValue: exercise.description }),
        instructions: Array.isArray(translatedInstructions) ? translatedInstructions : exercise.instructions,
        proTips: Array.isArray(translatedProTips) ? translatedProTips : exercise.proTips,
        benefits: Array.isArray(translatedBenefits) ? translatedBenefits : exercise.benefits,
      };
    };
  }, [t]);

  return { translateExercise };
};

export default useTranslatedExercises;

