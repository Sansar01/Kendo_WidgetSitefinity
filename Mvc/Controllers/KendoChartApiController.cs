using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Telerik.Sitefinity.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

namespace Kendo_WidgetSitefinity.Mvc.Controllers
{
    [ControllerToolboxItem(Name = "KendoChart", SectionName = "Kendos", Title = "Kendo Charts")]
    public class KendoChartApiController : Controller
    {
        // GET: KendoChartApi
        public ActionResult Index()
        {
            return View("Default");
        }
    }
}