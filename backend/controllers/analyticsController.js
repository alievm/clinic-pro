// ✅ controllers/analyticsController.js
const Product = require("../models/Product");
const StockEntry = require("../models/StockEntry");
const StockUsage = require("../models/StockUsage");
const Visit = require("../models/Visit");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Service = require("../models/Service");
const mongoose = require("mongoose");

// 📊 Общая аналитика по складу
const getInventoryAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const lowStock = await Product.countDocuments({
      track: true,
      $expr: { $lt: ["$stock", "$minStock"] }
    });

    const trackedProducts = await Product.countDocuments({ track: true });
    const untrackedProducts = totalProducts - trackedProducts;

    const totalIncoming = await StockEntry.aggregate([
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$quantity" },
          totalEntries: { $sum: 1 }
        }
      }
    ]);

    const totalUsed = await StockUsage.aggregate([
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$quantity" },
          totalUsages: { $sum: 1 }
        }
      }
    ]);

    // 🔝 ТОП-5 списываемых товаров
    const topUsedProducts = await StockUsage.aggregate([
      {
        $group: {
          _id: "$product",
          totalQty: { $sum: "$quantity" }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          product: "$product.name",
          totalQty: 1
        }
      }
    ]);

    // 📂 Остатки по категориям
    const stockByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalStock: { $sum: "$stock" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          totalStock: 1,
          count: 1
        }
      }
    ]);

    // 📅 Ежемесячный расход за последние 6 месяцев
    const usageByMonth = await StockUsage.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalQty: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: { format: "%m/%Y", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } }
          },
          totalQty: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    // 📦 Ежемесячный приход за последние 6 месяцев
    const incomingByMonth = await StockEntry.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalQty: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: { format: "%m/%Y", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } }
          },
          totalQty: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json({
      totalProducts,
      trackedProducts,
      untrackedProducts,
      lowStock,
      totalIncoming: totalIncoming[0]?.totalQty || 0,
      totalEntries: totalIncoming[0]?.totalEntries || 0,
      totalUsed: totalUsed[0]?.totalQty || 0,
      totalUsages: totalUsed[0]?.totalUsages || 0,
      topUsedProducts,
      stockByCategory,
      usageByMonth,
      incomingByMonth
    });
  } catch (err) {
    console.error("Inventory Analytics Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 Аналитика по визитам
const getVisitAnalytics = async (req, res) => {
    try {
      // Общее количество визитов
      const totalVisits = await Visit.countDocuments();
  
      // Визиты по статусам
      const statusStats = await Visit.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
  
      // Кол-во визитов по месяцам (для графика)
      const visitsByMonth = await Visit.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
        {
          $project: {
            month: {
              $dateToString: {
                format: "%m/%Y",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: 1
                  }
                }
              }
            },
            count: 1
          }
        },
        { $sort: { month: 1 } }
      ]);
  
      // ТОП-5 докторов по количеству визитов
      const topDoctors = await Visit.aggregate([
        {
          $group: {
            _id: "$doctor",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "doctor"
          }
        },
        { $unwind: "$doctor" },
        {
          $project: {
            doctor: "$doctor.name",
            count: 1
          }
        }
      ]);
  
      // Общая выручка по визитам
      const revenue = await Payment.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
            paid: { $sum: "$paidAmount" }
          }
        }
      ]);
  
      res.json({
        totalVisits,
        statusStats,
        visitsByMonth,
        topDoctors,
        revenue: revenue[0] || { total: 0, paid: 0 }
      });
    } catch (err) {
      console.error("Visit Analytics Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };


  const getPaymentAnalytics = async (req, res) => {
    try {
      // Общая сумма оплат
      const summary = await Payment.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
            paid: { $sum: "$paidAmount" }
          }
        }
      ]);
  
      // Оплаты по статусам
      const statusStats = await Payment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 }, amount: { $sum: "$totalAmount" } } }
      ]);
  
      // 📆 Месячная выручка (последние 6 месяцев)
      const revenueByMonth = await Payment.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            total: { $sum: "$totalAmount" },
            paid: { $sum: "$paidAmount" }
          }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
        {
            $project: {
              _id: 0,
              month: {
                $dateToString: {
                  format: "%m/%Y",
                  date: {
                    $dateFromParts: {
                      year: "$_id.year",
                      month: "$_id.month",
                      day: 1
                    }
                  }
                }
              },
              total: "$total",
              paid: "$paid"
            }
          },
        { $sort: { month: 1 } }
      ]);
  
      // 📈 ТОП-5 самых популярных услуг по количеству использования в оплатах
      const topServices = await Payment.aggregate([
        { $unwind: "$services" },
        {
          $group: {
            _id: "$services.service",
            totalQty: { $sum: "$services.quantity" }
          }
        },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "services",
            localField: "_id",
            foreignField: "_id",
            as: "service"
          }
        },
        { $unwind: "$service" },
        {
          $project: {
            _id: 0,
            service: "$service.name",
            totalQty: 1
          }
        }
      ]);
  
      res.json({
        total: summary[0]?.total || 0,
        paid: summary[0]?.paid || 0,
        unpaid: (summary[0]?.total || 0) - (summary[0]?.paid || 0),
        statusStats,
        revenueByMonth,
        topServices
      });
    } catch (err) {
      console.error("Payment Analytics Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  const getProfitabilityAnalytics = async (req, res) => {
    try {
      // 🔹 Прибыль по услугам
      const payments = await Payment.find().populate("services.service");
  
      const serviceMap = new Map(); // { serviceId => { name, income, count } }
  
      for (const payment of payments) {
        for (const item of payment.services) {
          const s = item.service;
          const income = s.price * item.quantity;
  
          if (!serviceMap.has(s._id.toString())) {
            serviceMap.set(s._id.toString(), {
              service: s.name,
              income,
              count: item.quantity
            });
          } else {
            const entry = serviceMap.get(s._id.toString());
            entry.income += income;
            entry.count += item.quantity;
          }
        }
      }
  
      const servicesProfit = Array.from(serviceMap.values()).sort((a, b) => b.income - a.income);
  
      // 🔹 Прибыль по врачам
      const visits = await Visit.find().populate("services.service doctor");
  
      const doctorMap = new Map(); // { doctorId => { name, income } }
  
      for (const visit of visits) {
        let total = 0;
  
        for (const item of visit.services) {
          const s = await Service.findById(item.service);
          if (s) total += s.price * item.quantity;
        }
  
        const docId = visit.doctor._id.toString();
  
        if (!doctorMap.has(docId)) {
          doctorMap.set(docId, {
            doctor: visit.doctor.name,
            income: total,
            visits: 1
          });
        } else {
          const entry = doctorMap.get(docId);
          entry.income += total;
          entry.visits += 1;
        }
      }
  
      const doctorsProfit = Array.from(doctorMap.values()).sort((a, b) => b.income - a.income);
  
      res.json({
        servicesProfit,
        doctorsProfit
      });
    } catch (err) {
      console.error("Profitability Analytics Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = { getInventoryAnalytics, getVisitAnalytics, getPaymentAnalytics, getProfitabilityAnalytics };
