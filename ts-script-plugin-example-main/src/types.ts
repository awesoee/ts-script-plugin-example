import { IPluginConfig } from '@fraytools/plugin-core/lib/types';
import { IScriptAssetMetadata } from '@fraytools/plugin-core/lib/types/fraytools';


export interface IFraymakersScriptConfig extends IPluginConfig {

}

export interface IFraymakersAssetMetadata extends IScriptAssetMetadata {
    pluginMetadata:{
      [key:string]:any,
      'my.example.script.asset.plugin'?: {
      }
    }
  }