﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using human_managerment_backend;
using human_managerment_backend.Entities;
using HumanManagermentBackend.Dto;
using HumanManagermentBackend.Models;
using HumanManagermentBackend.Services;
using HumanManagermentBackend.Services.Impl;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HumanManagermentBackend.Controller
{
    [Route("/working-times")]
    [ApiController]
    public class WorkingTimerController : ControllerBase
    {
        private readonly WorkingTimeService _workingTimeService;

        //private readonly WorkingTimeDetailService _workingTimeDetailService;

        public WorkingTimerController(WorkingTimeServiceImpl workingTimeService)
        {
            _workingTimeService = workingTimeService;
        }

        [HttpGet]
        public ActionResult<Api<List<WorkingTimeDTO>>> GetAll(//
                                                              [FromQuery(Name = "page"), DefaultValue(1), Required] int page,//
                                                              [FromQuery(Name = "page_limit"), DefaultValue(10),] int limit//
                                                              )
        {
            int totalItems = _workingTimeService.CountAll();

            int totalPages = (int)Math.Ceiling((double)totalItems / limit);

            List<WorkingTimeDTO> dtos = _workingTimeService.FindAll(page, limit);

            Api<List<WorkingTimeDTO>> result = new Api<List<WorkingTimeDTO>>(200, dtos, "Success", new Paging(page, limit,totalPages, totalItems));

            return Ok(result);
        }

        //     {
        //    "name": "Ca Som",
        //    "bio": null,
        //    "workingTimeDetails": [
        //        {
        //            "timeSlotId": 1
        //        },
        //         {
        //            "timeSlotId": 2
        //        }
        //    ]
        //}
        [HttpPost]
        public ActionResult<Api<WorkingTimeDTO>> New(WorkingTimeEntity newEntity)
        {
            WorkingTimeDTO dto = _workingTimeService.Save(newEntity);
            Api<WorkingTimeDTO> result = new Api<WorkingTimeDTO>(200, dto, "Add Success");
            return Ok(result);
        }

        //     {
        //    "name": "Ca Som",
        //    "bio": "thong tin chinh sua",
        //    "workingTimeDetails": [
        //        {
        //            "timeSlotId": 1
        //        },
        //         {
        //            "timeSlotId": 2
        //        }
        //    ]
        //}
        [HttpPut("{id}")]
        public ActionResult<Api<WorkingTimeDTO>> Edit(long id, WorkingTimeEntity newEntity)
        {
            newEntity.Id = id;
            newEntity.WorkingTimeDetails.ForEach(wtd => wtd.WorkingTimeId = id);

            WorkingTimeDTO dto = _workingTimeService.Replace(newEntity);
            Api<WorkingTimeDTO> result = new Api<WorkingTimeDTO>(200, dto, "Edit Success");
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public ActionResult<Api<WorkingTimeDTO>> Delete(long id, WorkingTimeEntity newEntity)
        {
            newEntity.Id = id;

            bool delResult = _workingTimeService.Delete(newEntity);
            Api<bool> result;
            if (delResult)
                result = new Api<bool>(200, delResult, "Delete Success");
            else
                result = new Api<bool>(200, delResult, "Delete Failure");
            return Ok(result);
        }
    }

}