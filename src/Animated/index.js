import React, {Component} from "react";
import {View, Animated, Dimensions} from "react-native";
import {AnimatedSurface} from "gl-react-native";
import GL from "gl-react";


var {height,width} =  Dimensions.get('window');
export default class AnimatedExample extends Component {
  state = {
    heightValue: new Animated.Value(200),
  };
  componentWillMount () {
    let i = 0;
    this.interval = setInterval(() =>
      Animated.spring(this.state.heightValue, {
        toValue: ++i % 2 ? 500 : 200,
      }).start(), 2000);
  }
  componentWillUnmount () {
    clearInterval(this.interval);
  }
  render () {
    const { heightValue } = this.state;
    return <View style={{ paddingTop: 60, alignItems: "center" }}>
      <AnimatedSurface
        width={width}
        height={height}>
        <GL.Node shader={{// inline example
            frag: `
            precision highp float;
            uniform float time;
            uniform vec2 resolution;
        
            void main( void )
            {
              vec2 uv = ( gl_FragCoord.xy / resolution.xy )*4.0;
            
              float i0=1.2;
              float i1=0.95;
              float i2=1.5;
              vec2 i4=vec2(0.0,0.0);
              for(int s=0;s<4;s++)
              {
                vec2 r;
                r=vec2(cos(uv.y*i0-i4.y+time/i1),sin(uv.x*i0+i4.x+time/i1))/i2;
                r+=vec2(-r.y,r.x)*0.2;
                uv.xy+=r;
                    
                i0*=115.93;
                i1*=729.1;
                i2*=14.7;
                i4+=r.xy*1.0+0.5*time*i1;
              }
              float r=sin(uv.x-time)*0.5+0.5;
              float b=sin(uv.y+time)*0.5+0.5;
              float g=sin((sqrt(uv.x*uv.x+uv.y*uv.y)+time))*0.5+0.5;
              vec3 c=vec3(r,g,b);
              gl_FragColor = vec4(c,1.0);
            }
            `
          }
        }
        uniforms={{
          time: 2.0,
          resolution: [width, height]
        }}
        />
    </AnimatedSurface>
    </View>;
  }
}
