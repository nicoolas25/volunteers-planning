var placement = null;

function isFree($destination) {
  return $destination.is("td") &&
    !$destination.is(".impossible") &&
    !$destination.closest("tr").is(".locked");
}

function ensureOnePlacement($volunteer, $line) {
  var id = $volunteer.data("volunteer");
  var $sameLineVolunteer = $line.find("span[data-volunteer='" + id + "']");
  $sameLineVolunteer.remove();
}

function volunteerCount($volunteer) {
  var id = $volunteer.data("volunteer");
  return $("#planning span[data-volunteer='" + id + "']").size();
}

function placeVolunteer($volunteer, $destination) {
  var id = $volunteer.data("volunteer");
  if ($destination.find("span[data-volunteer='" + id + "']")[0]) return;
  ensureOnePlacement($volunteer, $destination.closest("tr"));
  var volunteerLabel = $volunteer[0].outerHTML;
  $destination.append(volunteerLabel + " ");
}

function removePlacement($volunteer) {
  $volunteer.remove();
  showAllAvailableVolunteers();
}

function showAllAvailableVolunteers() {
  placement = null;
  $("#names span").each(function() {
    if (volunteerCount($(this)) < 5) {
      $(this).fadeIn();
    } else {
      $(this).fadeOut();
    }
  });
}

function hideOthersThan($volunteer) {
  $("#names span").each(function() { if ($volunteer[0] != this) $(this).fadeOut(); });
}

function findDestination(event) {
  var $target = $(event.target);
  if ($target.is("td")) {
    return $target;
  } else {
    var $td = $target.closest("td");
    if ($td.size() > 0) return $td;
    else return $target;
  }
}

function waitPlacement($volunteer) {
  if (volunteerCount($volunteer) >= 5) {
    showAllAvailableVolunteers();
    return;
  }

  placement = $volunteer;
  $(document).one("click", function (event) {
    var $destination = findDestination(event);
    if (isFree($destination)) {
      placeVolunteer($volunteer, $destination);
      waitPlacement($volunteer);
    } else {
      showAllAvailableVolunteers();
    }
    return true;
  });
  hideOthersThan($volunteer);
}

$(function () {
  $("#planning").on("click", ".label-volunteer", function (event) {
    if (placement == null) {
      removePlacement($(event.target));
      event.stopPropagation();
      return false;
    } else {
      return true;
    }
  });

  $("#names .label-volunteer").on("click", function (event) {
    if (placement == null) waitPlacement($(event.target));
    event.stopPropagation();
    return false;
  });
});
