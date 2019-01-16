/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import GradientBg from './app/GradientBg.js';
import FadeInView from './app/FadeInView.js';
import { Surface } from "gl-react-native";
import GL from "gl-react";
import HelloGL from "./src/Simple/HelloGL";
import AnimatedExample3 from './src/Particles/index.js';
// import Hearts from './src/Hearts/index';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
var {height,width} =  Dimensions.get('window');
shaders = GL.Shaders.create({
  Hello: {
    frag: `
      void main () {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // red
      }
    `
  },
  Test1: {
    frag:
    `
          precision mediump float;
          uniform float time;
          uniform vec2 resolution;

          mat2 rotate(float a) 
          {
            float c = cos(a),
            s = sin(a);
            return mat2(c, -s, s, c);
          }

          void main() {
            vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
            vec3 color = vec3(0);
            vec3 rd = vec3(uv, 0.0);
              
            for (int i = 0; i < 2; i++) {
              color.r += length(rd) / max(abs(rd.x), abs(rd.y) * 8.0) * 0.1;
              color.g += length(rd) / max(abs(rd.x), abs(rd.y) * 5.7) * 0.11;
                    rd.xy -= 0.2;
                    rd.xy *= rotate(0.01 + time * 0.3);
                    rd.xz *= rotate(0.02 + time);
            }
            gl_FragColor = vec4(color, 1);
          }
    `
  },
  Test2: {
    frag:
    `
    precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    
    void main( )
    {
      vec2 uv = (gl_FragCoord.xy / resolution.xx-0.5)*8.0;
        vec2 uv0=uv;
      float i0=1.0;
      float i1=1.0;
      float i2=1.0;
      float i4=0.0;
      for(int s=0;s<7;s++)
      {
        vec2 r;
        r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
            r+=vec2(-r.y,r.x)*0.3;
        uv.xy+=r;
            
        i0*=1.93;
        i1*=1.15;
        i2*=1.7;
        i4+=0.05+0.1*time*i1;
      }
        float r=sin(uv.x-time)*0.5+0.5;
        float b=sin(uv.y+time)*0.5+0.5;
        float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*0.5+0.5;
      gl_FragColor = vec4(r,g,b,1.0);
    }
    `
  },
  Test3: {
    frag:
    `
          precision mediump float;
          
          uniform vec2 resolution;
          uniform float time;
          
          void main()
          {
            vec2 uv = (gl_FragCoord.xy / resolution.xx)*1.0;
          
              float r=sin(uv.x+time)*1.0;
              float b=sin(uv.y-time)*1.0;
              float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*1.0;
            gl_FragColor = vec4(r,g,b,1.0);
          }
    `
  }
  ,
  Test4: {
    frag:
    `
    precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    
    /*
     * This function will function like an array.
     */
    vec2 getWaveSource(int ws)
    {
      vec2 outp;
      if (ws == 0)
      {
        outp = vec2(-100,-100);
      }
      else if (ws == 1)
      {
        outp = vec2(-100,500);
      }
      else
      {
        outp = vec2(500,-500);
      }
      return outp;
    }
    /*
     * Don't need an expensive square root operation.
     * This returns distance squared, not distance.
     */
    float distanceSq(vec2 a, vec2 b)
    {
      vec2 diff = a - b;
      return dot(diff, diff);
    }
    void main()
    {
      const int wsCount = 1;
      
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      
      float wavePower = 0.0;
      for(int i=0; i<wsCount; i++)
      {
        vec2 src = getWaveSource(i);
        float dist = distanceSq(src, uv) / 5000.0;
        wavePower += sin((dist + time));
        
      }
      gl_FragColor = vec4(
        0.5 + 0.5 * sin(wavePower),
        0.5 + 0.5 * cos(time),
        0.5 + 0.5 * sin(time),
        1.0
      );
    }
    
    `
  }
});

export default class App extends Component {

  componentWillMount () {
    this.state = {count : 1.0};
 
    this.interval = setInterval(() =>  {
      let {count} = this.state;
      count = count + 0.01;
      this.setState({count: count});
    });
  }
  componentWillUnmount () {
    clearInterval(this.interval);
  }

  render() {
    let {count} = this.state;
    return (
      // <View>
      //   <Text>React Native!</Text>
      //  <GradientBg styles={{
      //    width: 250,
      //    height: 250,
      //  }}></GradientBg>
      // </View>
     
      <View>
        {/* <AnimatedExample3/> */}
           <Surface width={width} height={height} autoRedraw={true}>
           <GL.Node
              shader={shaders.Test2}
              uniforms={{
                time: count,
                resolution: [width, height]
              }}
              />
           </Surface>
    </View>
    );
  }
}

