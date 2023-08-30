import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
// Import FrayToolsPluginCore.js and BaseScriptAssetPlugin.js
import './MyExampleScriptAssetPlugin.scss'
import FrayToolsPluginCore from '@fraytools/plugin-core';
import BaseScriptAssetPlugin, { IScriptAssetPluginProps, IScriptAssetPluginState } from '@fraytools/plugin-core/lib/base/BaseScriptAssetPlugin';
import { IManifestJson } from '@fraytools/plugin-core/lib/types';
import { IFraymakersScriptConfig, IFraymakersAssetMetadata } from './types';
import { IScriptAssetMetadata } from '@fraytools/plugin-core/lib/types/fraytools';

const semverCompare = require('semver-compare');

declare var MANIFEST_JSON:IManifestJson;

interface IFraymakersScriptProps extends IScriptAssetPluginProps {
  configMetadata: IFraymakersScriptConfig;
  assetMetadata: IFraymakersAssetMetadata;
}

interface IFraymakersScriptState extends IScriptAssetPluginState {
  
}

/**
 * Example view for the script asset plugin.
 */
export default class MyScriptAssetPlugin extends BaseScriptAssetPlugin<IFraymakersScriptProps, IFraymakersScriptState> {  

  constructor(props) {
    super(props);


    this.state = {

    };

  }

  public static getDefaultSettings():IFraymakersScriptConfig {
    return {
      version: MANIFEST_JSON.version,
    };
  }
  /**
   * This function will be triggered if new props are received at any point prevProps 
   */
  componentDidUpdate(prevProps) {
    // Add implementation to handle new props being received here
  }

  /**
   * Force this component to re-render when parent window sends new props
   */
  onPropsUpdated(props) {
    ReactDOM.render(<MyScriptAssetPlugin {...props} />, document.querySelector('.MyScriptAssetPluginWrapper'));
  }

  /**
   * Update script text when the parent changes
   */
   onScriptChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
     // Clone asset metadata
     var scriptAssetMetadata:IScriptAssetMetadata = {

        script:null,
        language:this.props.assetMetadata.language,
        version:this.props.assetMetadata.version,
        id:this.props.assetMetadata.id,
        guid:this.props.assetMetadata.guid,
        export:this.props.assetMetadata.export,
        tags:this.props.assetMetadata.tags,
        plugins:this.props.assetMetadata.plugins,
        pluginMetadata:this.props.assetMetadata.pluginMetadata

    };

     for (var key in this.props.assetMetadata) {
       if (!this.props.assetMetadata.hasOwnProperty(key)) {
         continue;
       }
       scriptAssetMetadata[key] = this.props.assetMetadata[key];
     }
     // Assign updated script text
     scriptAssetMetadata.script = event.target.value;

     // Sync with parent window
     FrayToolsPluginCore.assetMetadataSync(scriptAssetMetadata)
  }

  render() {
    if (this.props.configMode) {
      // If configMode is enabled, display a different view specifically for configuring plugin metadata
      return (
        <div className='MyScriptAssetConfig'>

          <h2>My Example Script Asset Plugin v{MANIFEST_JSON.version}</h2>
          <br/>
          <p>{JSON.stringify(MANIFEST_JSON, null, 2)}</p>
          <br/>
          <p>Hello world! This is an example configuration view for a ScriptAsset plugin.</p>
          <p>Here you would provide a UI for assigning custom settings to persist between sessions using 'pluginConfigSyncRequest' postMessage() commands sent to the parent window. This data will then be persisted within the current FrayTools project settings file.</p>

        </div>
      );
    }

    // Display some basic information
    return (
      <div className="MyScriptAssetComponent">
        <p>Hello world! This is an example editor view for a ScriptAsset plugin. Implement a custom UI here for editing your script, and pass the updated script contents and asset metadata back to the parent window with a 'pluginAssetMetadataSyncRequest' postMessage() command. This data will be persisted in the asset's metadata file.</p>
        <p>See the original text from the script asset below (and editing it will affect the real script!):</p>
        <textarea style={{ width: '100%', height: '400px', background:'#222222' }} defaultValue={this.props.assetMetadata.script} onChange={this.onScriptChanged.bind(this)}/>
        <p></p>
        <p></p>
      </div>
    );
  }
}