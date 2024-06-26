import React from 'react';
import {StyleProp, StyleSheet, ViewStyle,Text} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {SlideButtonCommonProps} from './SlideButton';


export interface SlideButtonThumbProps extends SlideButtonCommonProps {
  gestureHandler?:
    | ((event: GestureEvent<PanGestureHandlerEventPayload>) => void)
    | undefined;
 
  thumbStyle?: StyleProp<ViewStyle>;
  animStarted?: () => void;
  animEnded?: () => void;
  thumbTitle:String
}

const SlideButtonThumb = ({
  
  gestureHandler,
  translateX,
  height,
  padding,
  endReached,
  borderRadius,
  thumbStyle,
  animStarted,
  animEnded,
  
  animation,
  animationDuration,
  dynamicResetEnabled,
  dynamicResetDelaying,
  thumbTitle
}: SlideButtonThumbProps) => {

  const opacityValue = useSharedValue(1);

  const play = () => {
    const repeatCount = dynamicResetEnabled ? -1 : 6;
    opacityValue.value = withRepeat(
      withTiming(
        0.4,
        {duration: animationDuration!, easing: Easing.inOut(Easing.ease)},
      ),
      repeatCount,
      true,
      () => {
        runOnJS(animFinished)();
      },
    );
  };

  const stop = () => {
    cancelAnimation(opacityValue);
    runOnJS(animFinished)();
  }

  const animFinished = () => {
    animEnded && animEnded();
  };

  const thumbAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: endReached ? opacityValue.value : 1,
      transform: [{translateX: translateX.value}],
    };
  });

  const thumbDynamicStyle = {
    left: padding,
    width: height,
    height,
    borderRadius,
  };

 

  React.useEffect(() => {
    if (endReached) {
      if (animation) {
        animStarted && animStarted();
        play();
      }  
    }
  }, [endReached]);

  React.useEffect(() => {
    if (dynamicResetEnabled) {
      if (!dynamicResetDelaying) {
        stop()
      }  
    }
  }, [dynamicResetDelaying]);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        testID="ThumbContainer"
        style={[
          styles.thumbContainer,
          thumbAnimStyle,
          thumbDynamicStyle,
          thumbStyle,
        ]}>
          <Text style={styles.thumbContainer}>{thumbTitle}</Text>
       
      </Animated.View>
    </PanGestureHandler>
  );
};

export default React.memo(SlideButtonThumb);

const styles = StyleSheet.create({
  thumbContainer:{
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbTitleStyle:{
    alignItems: 'center',
    justifyContent: 'center',
    fontSize:17,
    fontWeight:'500'
 }
});
