FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
      stylePanelAspectRatio: 200 / 200,
      imageResizeTargetWidth: 100,
      imageResizeTargetHeight: 100
  })
  
FilePond.parse(document.body);
