import React from 'react';
import useService from './service';
import useStyles from './styles';
import {
  FlatList,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Screen } from '@Templates';
import { Colors, FontFamily } from 'Theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import SlideButton from 'rn-slide-button';
import MapView, { Marker } from 'react-native-maps';
import { SkypeIndicator } from 'react-native-indicators';
import axios from 'axios';
import Async from 'Store/Async';
const Home = props => {
  const navigation = useNavigation();
  const {
    online,
    setOnline,
    driverLocation,
    setDriverLocation,
    getCurrentLocation,
    rideData,
    locationData,
    driverStatus,
    loader,
    setLoader,
    updateDriverData,
    loading,
    driverLoading,
    currDriverLoader,
    currDriverData,
    eventData,
    driverOnline
  } = useService(props);
  const { headView, flatlistView, headText } = useStyles();
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('RideDetails', { data: item });
        }}>
        <View style={flatlistView}>
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name={'map-marker-circle'}
              color={Colors.white}
              size={30}
              style={{ alignSelf: 'center' }}></Icon>
            <View
              style={{
                flexDirection: 'column',
                marginLeft: responsiveWidth(2)
              }}>
              <Text style={headText}>{item?.name}</Text>
              <Text style={[headText, { color: Colors.greyText }]}>
                {item?.mile}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: responsiveWidth(40),
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}>
            <View style={{ flexDirection: 'column' }}>
              <Icon
                name={'clock'}
                color={Colors.grey}
                size={20}
                style={{ alignSelf: 'center' }}></Icon>
              <Text
                style={[
                  headText,
                  { color: Colors.greyText, alignSelf: 'center' }
                ]}>
                {item?.time}
              </Text>
            </View>

            <View style={{ flexDirection: 'column' }}>
              <Text
                style={[
                  headText,
                  {
                    color: Colors.greyText,
                    alignSelf: 'center',
                    position: 'absolute',
                    left: responsiveWidth(5),
                    top: -12
                  }
                ]}>
                {item?.min}
              </Text>

              <Icon
                name={'clock'}
                color={Colors.grey}
                size={20}
                style={{ alignSelf: 'center' }}></Icon>
              <Text
                style={[
                  headText,
                  { color: Colors.greyText, alignSelf: 'center' }
                ]}>
                {item?.time1}
              </Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Icon
                name={'car'}
                color={Colors.grey}
                size={20}
                style={{ alignSelf: 'center' }}></Icon>
              <Text
                style={[
                  headText,
                  { color: Colors.greyText, alignSelf: 'center' }
                ]}>
                {item?.cars}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const updateDriver = async flag => {
    await Async.setItem(Async.Item.driverStatus, flag);
  };
  return (
    <Screen>
      <View style={headView}>
        <Icon
          onPress={() => {
            props.navigation.openDrawer();
          }}
          name={'home'}
          color={Colors.white}
          size={30}
          style={{ alignSelf: 'center' }}></Icon>
        <SlideButton
          callHandleComplete={driverOnline}
          title={online === true ? 'Position \n Base       ' : null}
          thumbTitle={online === true ? 'Online' : 'Offline'}
          // animation={true}
          onReachedToEnd={() => {
            console.log('\n\n end');
            setOnline(true);
            updateDriver(true);
            // updateDriverData(true);
            // driverStatus(true);
          }}
          value={true}
          onReachedToStart={() => {
            console.log('\n\n Start');
            setOnline(false);
            updateDriver(false);

            // updateDriverData(false);

            // driverStatus(false);
          }}
          height={52}
          titleStyle={{
            alignSelf: 'flex-start',
            marginLeft: responsiveWidth(4)
          }}
          thumbStyle={{
            backgroundColor: online === true ? Colors.online : Colors.offline,
            width: responsiveWidth(30),
            justifyContent: 'center',
            alignItems: 'center'
          }}
          borderRadius={50}
          padding={2}
          // default={true}
          containerStyle={{
            backgroundColor: Colors.transparent,
            width: responsiveWidth(60),
            borderColor: online === true ? Colors.online : Colors.offline,
            borderWidth: 1,
            marginLeft: responsiveWidth(5)
          }}
        />
        <Icon
          name={'email-outline'}
          color={Colors.white}
          size={30}
          style={{
            alignSelf: 'center',
            marginLeft: responsiveWidth(2)
          }}></Icon>
        <Icon
          name={'chevron-double-left'}
          color={Colors.white}
          size={30}
          style={{
            alignSelf: 'center',
            marginLeft: responsiveWidth(2)
          }}></Icon>
      </View>
      {/* {online === false ? ( */}
      <View style={{ overflow: 'hidden' }}>
        <MapView
          style={{
            marginTop: 10,
            height:
              Platform.OS === 'ios'
                ? responsiveHeight(80)
                : responsiveHeight(80),
            width: responsiveWidth(100),
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center'
          }}
          region={{
            latitude:
              Object.keys(locationData).length == 0
                ? 51.277249842314774
                : parseFloat(locationData?.latitude), //33.59839,
            longitude:
              Object.keys(locationData).length == 0
                ? 1.083897322734104
                : parseFloat(locationData?.longitude), //73.04414,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          showsUserLocation={true}
          showsPointsOfInterest={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsTraffic={true}
          showsScale={true}
          loadingEnabled={false}
          scrollDuringRotateOrZoomEnabled={true}>
          {/* <Marker
            onPress={() => {
              getCurrentLocation(
                driverLocation.latitude,
                driverLocation.longitude
              );
            }}
            coordinate={{
              latitude:
                Object.keys(locationData).length == 0
                  ? 51.277249842314774
                  : parseFloat(locationData?.latitude), //33.59839,
              longitude:
                Object.keys(locationData).length == 0
                  ? 1.083897322734104
                  : parseFloat(locationData?.longitude) //73.04414
            }}></Marker> */}
        </MapView>
      </View>
      {/* // ) : (
      //   <View>
      //     <FlatList data={rideData} renderItem={renderItem}></FlatList>
      //   </View>
      // )} */}
      <View
        style={{
          position: 'absolute',
          left: responsiveWidth(45),

          top: responsiveHeight(70)
        }}>
        {/* {driverLoading && (
          <SkypeIndicator
            color={Colors.online}
            size={60}
            style={{ position: 'absolute', top: responsiveHeight(-20) }}
          />
        )} */}
        {currDriverLoader || loading || driverLoading ? (
          <SkypeIndicator
            color={Colors.online}
            size={60}
            style={{ position: 'absolute', top: responsiveHeight(-20) }}
          />
        ) : null}

        {/* {loading && <SkypeIndicator color={Colors.iconBgc} />} */}
      </View>
    </Screen>
  );
};

export default Home;
