(function ($) {
    angular.module('designer').requires.push('expander', 'sfSelectors', 'sfImageField', 'sfFields', 'ngSanitize');

    angular.module('designer').controller('SimpleCtrl', ['$scope','serviceHelper', 'sfMediaService', 'propertyService', function ($scope,serviceHelper, mediaService, propertyService) {
        var sortOptions = ['PublicationDate DESC', 'LastModified DESC', 'Title ASC', 'Title DESC', 'AsSetManually'];
        var emptyGuid = '00000000-0000-0000-0000-000000000000';

        $scope.feedback.showLoadingIndicator = true;
        $scope.additionalFilters = {};
        $scope.newsSelector = { selectedItemsIds: [] };
        $scope.selectedImageId = null;
        $scope.selectedImage = null;
        $scope.imageProvider = null;

        $scope.$watch('selectedImageId', function (newImageId, oldImageId) {
            if (newImageId != oldImageId) {
                $scope.selectedImageId = newImageId
                console.log("id ", newImageId, $scope.selectedImageId)
                var propertyValue = newImageId;
                //if (propertyValue && propertyValue !== serviceHelper.emptyGuid()) {
                    mediaService.images.getById(propertyValue, $scope.properties.ProviderName.PropertyValue).then(function (data) {
                       // $scope.properties.selectedImageId = serviceHelper.emptyGuid();
                            console.log("data ",data)
                    });
                //}
            }
        },
            true
        );
        $scope.$watch('imageProvider', function (newimageProvider, oldimageProvider) {
            if (newimageProvider != oldimageProvider) {
                $scope.imageProvider.PropertyValue = newimageProvider
                console.log("image provider ", newimageProvider)
            }
        },
            true
        );
        $scope.$watch('selectedImage', function (newselectedImage, oldselectedImage) {
            if (newselectedImage != oldselectedImage) {
                $scope.selectedImage.PropertyValue = newselectedImage
                console.log("image select ", $scope.selectedImage.PropertyValue)
            }
        },
            true
        );

        $scope.$watch(
            'additionalFilters.value',
            function (newAdditionalFilters, oldAdditionalFilters) {
                if (newAdditionalFilters !== oldAdditionalFilters) {
                    $scope.properties.SerializedAdditionalFilters.PropertyValue = JSON.stringify(newAdditionalFilters);
                }
            },
            true
        );

        $scope.$watch(
            'properties.ProviderName.PropertyValue',
            function (newProviderName, oldProviderName) {
                newProviderName = newProviderName || "";
                oldProviderName = oldProviderName || ""; // These are new lines

                if (newProviderName !== oldProviderName) {
                    $scope.properties.SelectionMode.PropertyValue = 'AllItems';
                    $scope.properties.SerializedSelectedItemsIds.PropertyValue = null;
                }
            },
            true
        );

        $scope.$watch(
            'newsSelector.selectedItemsIds',
            function (newSelectedItemsIds, oldSelectedItemsIds) {
                if (newSelectedItemsIds !== oldSelectedItemsIds) {
                    if (newSelectedItemsIds) {
                        $scope.properties.SerializedSelectedItemsIds.PropertyValue = JSON.stringify(newSelectedItemsIds);
                        if (newSelectedItemsIds.length === 1) {
                            $scope.properties.ContentViewDisplayMode.PropertyValue = "Detail";
                        }
                        else {
                            $scope.properties.ContentViewDisplayMode.PropertyValue = "Automatic";
                        }
                    }
                }
            },
            true
        );

        $scope.$watch(
            'properties.SelectionMode.PropertyValue',
            function (newSelectionModeValue, oldSelectionModeValue) {
                if (newSelectionModeValue !== oldSelectionModeValue) {
                    if ($scope.properties.ContentViewDisplayMode.PropertyValue.toLowerCase() === "Detail".toLowerCase() && newSelectionModeValue !== "SelectedItems") {
                        $scope.properties.ContentViewDisplayMode.PropertyValue = "Automatic";
                    }
                }
            },
            true
        );

        $scope.updateSortOption = function (newSortOption) {
            if (newSortOption !== "Custom") {
                $scope.properties.SortExpression.PropertyValue = newSortOption;
            }
        };

        propertyService.get()
            .then(function (data) {
                if (data) {
                    $scope.properties = propertyService.toAssociativeArray(data.Items);

                    var additionalFilters = $.parseJSON($scope.properties.SerializedAdditionalFilters.PropertyValue || null);

                    $scope.additionalFilters.value = additionalFilters;

                    var selectedItemsIds = $.parseJSON($scope.properties.SerializedSelectedItemsIds.PropertyValue || null);

                    if (selectedItemsIds) {
                        $scope.newsSelector.selectedItemsIds = selectedItemsIds;
                    }

                    if (sortOptions.indexOf($scope.properties.SortExpression.PropertyValue) >= 0) {
                        $scope.selectedSortOption = $scope.properties.SortExpression.PropertyValue;
                    }
                    else {
                        $scope.selectedSortOption = "Custom";
                    }
                }
            },
                function (data) {
                    $scope.feedback.showError = true;
                    if (data)
                        $scope.feedback.errorMessage = data.Detail;
                })
            .then(function () {
                $scope.feedback.savingHandlers.push(function () {
                    if ($scope.properties.OpenInSamePage.PropertyValue && $scope.properties.OpenInSamePage.PropertyValue.toLowerCase() === 'true') {
                        $scope.properties.DetailsPageId.PropertyValue = emptyGuid;
                    }
                    else {
                        if (!$scope.properties.DetailsPageId.PropertyValue ||
                            $scope.properties.DetailsPageId.PropertyValue === emptyGuid) {
                            $scope.properties.OpenInSamePage.PropertyValue = true;
                        }
                    }

                    if ($scope.properties.SelectionMode.PropertyValue === "FilteredItems" &&
                        $scope.additionalFilters.value &&
                        $scope.additionalFilters.value.QueryItems &&
                        $scope.additionalFilters.value.QueryItems.length === 0) {
                        $scope.properties.SelectionMode.PropertyValue = 'AllItems';
                    }

                    if ($scope.properties.SelectionMode.PropertyValue !== "FilteredItems") {
                        $scope.properties.SerializedAdditionalFilters.PropertyValue = null;
                    }

                    if ($scope.properties.SelectionMode.PropertyValue !== 'SelectedItems') {
                        $scope.properties.SerializedSelectedItemsIds.PropertyValue = null;

                        // If the sorting expression is AsSetManually but the selection mode is AllItems or FilteredItems, this is not a valid combination.
                        // So set the sort expression to the default value: PublicationDate DESC
                        if ($scope.properties.SortExpression.PropertyValue === "AsSetManually") {
                            $scope.properties.SortExpression.PropertyValue = "PublicationDate DESC";
                        }

                        if ($scope.properties.ContentViewDisplayMode.PropertyValue.toLowerCase() === "Detail".toLowerCase()) {
                            $scope.properties.SelectionMode.PropertyValue = "SelectedItems";
                        }
                    }
                });
            })
            .finally(function () {
                $scope.feedback.showLoadingIndicator = false;
            });
    }]);
})(jQuery);