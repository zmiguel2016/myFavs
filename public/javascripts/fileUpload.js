//file pond uplaods images to database

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 1 / 1,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 100,
});

FilePond.parse(document.body);
